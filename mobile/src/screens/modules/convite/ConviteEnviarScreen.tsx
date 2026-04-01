import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiGet, apiPost } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput, Avatar, Badge, EmptyState, SearchBar } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { ConviteStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { extractListRows } from '../../../utils/listResponse';
import { selection } from '../../../utils/haptics';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<ConviteStackParamList, 'ConviteEnviar'>;
type Row = Record<string, unknown>;

/* ── Step type ──────────────────────────────────────────────── */
type Step = 'config' | 'selecao' | 'confirmacao';
type Contexto = 'ENVIAR_CONVITE' | 'LIBERAR_ACESSO';
type TipoConvite = 'PESSOA' | 'VEICULO' | 'PESSOA-VEICULO';
type Periodo = 'hoje' | 'amanha';

const TIPO_OPTIONS: { value: TipoConvite; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'PESSOA', label: 'Pessoa', icon: 'person' },
  { value: 'VEICULO', label: 'Veículo', icon: 'car' },
  { value: 'PESSOA-VEICULO', label: 'Pessoa + Veículo', icon: 'people' },
];

function formatDate(periodo: Periodo): string {
  const d = new Date();
  if (periodo === 'amanha') d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function ConviteEnviarScreen({ navigation }: Props) {
  /* ── Step 1: Config state ──────────────────────────────── */
  const [step, setStep] = useState<Step>('config');
  const [contexto, setContexto] = useState<Contexto>('ENVIAR_CONVITE');
  const [tipo, setTipo] = useState<TipoConvite>('PESSOA');
  const [periodo, setPeriodo] = useState<Periodo>('hoje');
  const [paId, setPaId] = useState('');
  const [paList, setPaList] = useState<Row[]>([]);
  const [paLoading, setPaLoading] = useState(false);

  /* ── Step 2: Selection state ───────────────────────────── */
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Row[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchLoading, setSearchLoading] = useState(false);

  /* ── Step 3: Sending ───────────────────────────────────── */
  const [sending, setSending] = useState(false);

  /* ── Load PAs ──────────────────────────────────────────── */
  const loadPAs = useCallback(async () => {
    if (paList.length > 0) return;
    setPaLoading(true);
    try {
      const res = await apiGet<unknown>('/ponto-atendimento', { limit: 100 });
      setPaList(extractListRows<Row>(res));
    } catch { /* ignore */ }
    finally { setPaLoading(false); }
  }, [paList.length]);

  /* ── Search items (Step 2) ─────────────────────────────── */
  const searchItems = useCallback(async () => {
    setSearchLoading(true);
    try {
      const isPessoa = tipo !== 'VEICULO';
      const endpoint = isPessoa ? '/pessoas/list' : '/veiculos';
      const params: Record<string, unknown> = { current: 1, limit: 50 };
      if (isPessoa && search) params.nome = search;
      if (!isPessoa && search) params.placa = search;
      if (paId) params.ponto_atendimento_id = Number(paId);

      const res = await apiPost<unknown>(endpoint, params);
      setItems(extractListRows<Row>(res));
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao buscar');
      setItems([]);
    } finally { setSearchLoading(false); }
  }, [tipo, search, paId]);

  const toggleItem = (id: string) => {
    void selection();
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ── Send invite (Step 3) ──────────────────────────────── */
  const handleSend = async () => {
    if (selected.size === 0) { showError('Selecione ao menos um item'); return; }
    setSending(true);
    try {
      const convidados = Array.from(selected).map((id) => {
        if (tipo === 'VEICULO') return { veiculo_id: Number(id) };
        return { pessoa_id: Number(id) };
      });

      await apiPost('/convite', {
        ponto_atendimento_id: Number(paId),
        data_liberacao: formatDate(periodo),
        categoria: contexto === 'ENVIAR_CONVITE' ? 'CONVITE' : 'LIBERACAO_DIRETA',
        tipo,
        nome: `Convite mobile - ${new Date().toLocaleDateString('pt-BR')}`,
        convidados,
      });
      showSuccess('Convite enviado com sucesso!');
      navigation.goBack();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao enviar');
    } finally { setSending(false); }
  };

  /* ── Render helpers ────────────────────────────────────── */
  const stepIndex = step === 'config' ? 0 : step === 'selecao' ? 1 : 2;

  const itemLabel = (item: Row) => {
    if (tipo === 'VEICULO') return String(item.placa ?? '—');
    return String(item.nome ?? item.name ?? '—');
  };

  const itemSub = (item: Row) => {
    if (tipo === 'VEICULO') return [item.marca, item.modelo].filter(Boolean).join(' ') || undefined;
    const parts: string[] = [];
    if (item.cpf) parts.push(String(item.cpf));
    if (item.celular) parts.push(String(item.celular));
    return parts.join(' · ') || undefined;
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.REGISTER}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Step indicator */}
        <View style={styles.stepBar}>
          {['Configuração', 'Seleção', 'Confirmação'].map((label, i) => (
            <View key={label} style={styles.stepItem}>
              <View style={[styles.stepCircle, i <= stepIndex && styles.stepActive]}>
                <Text style={[styles.stepNum, i <= stepIndex && styles.stepNumActive]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, i === stepIndex && styles.stepLabelActive]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* ── STEP 1: CONFIG ──────────────────────────────── */}
        {step === 'config' && (
          <ScrollView contentContainerStyle={styles.pad}>
            {/* Contexto */}
            <Text style={styles.section}>Tipo de processo</Text>
            <View style={styles.row}>
              {(['ENVIAR_CONVITE', 'LIBERAR_ACESSO'] as Contexto[]).map((c) => (
                <Pressable
                  key={c}
                  style={[styles.chip, contexto === c && styles.chipActive]}
                  onPress={() => { void selection(); setContexto(c); }}
                >
                  <Ionicons name={c === 'ENVIAR_CONVITE' ? 'mail' : 'shield-checkmark'} size={18} color={contexto === c ? colors.primary : colors.gray500} />
                  <Text style={[styles.chipText, contexto === c && styles.chipTextActive]}>
                    {c === 'ENVIAR_CONVITE' ? 'Enviar convite' : 'Liberar acesso'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Tipo */}
            <Text style={styles.section}>Tipo de entidade</Text>
            {TIPO_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                style={[styles.option, tipo === opt.value && styles.optionActive]}
                onPress={() => { void selection(); setTipo(opt.value); }}
              >
                <Ionicons name={opt.icon} size={22} color={tipo === opt.value ? colors.gateYellow : colors.gray500} />
                <Text style={[styles.optionText, tipo === opt.value && styles.optionTextActive]}>{opt.label}</Text>
                {tipo === opt.value && <Ionicons name="checkmark-circle" size={22} color={colors.gateYellow} />}
              </Pressable>
            ))}

            {/* Periodo */}
            <Text style={styles.section}>Período</Text>
            <View style={styles.row}>
              {(['hoje', 'amanha'] as Periodo[]).map((p) => (
                <Pressable
                  key={p}
                  style={[styles.chip, periodo === p && styles.chipActive]}
                  onPress={() => { void selection(); setPeriodo(p); }}
                >
                  <Text style={[styles.chipText, periodo === p && styles.chipTextActive]}>
                    {p === 'hoje' ? 'Hoje' : 'Amanhã'} ({formatDate(p)})
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* PA selection */}
            <Text style={styles.section}>Ponto de atendimento</Text>
            <AppTextInput
              label="ID do PA"
              value={paId}
              onChangeText={setPaId}
              placeholder="ID do ponto de atendimento"
              keyboardType="numeric"
              required
            />
            <AppButton
              label="Carregar PAs"
              variant="ghost"
              onPress={() => void loadPAs()}
              loading={paLoading}
            />
            {paList.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {paList.slice(0, 20).map((pa) => (
                  <Pressable
                    key={String(pa.id)}
                    style={[styles.paChip, paId === String(pa.id) && styles.paChipActive]}
                    onPress={() => setPaId(String(pa.id))}
                  >
                    <Text style={[styles.paChipText, paId === String(pa.id) && styles.paChipTextActive]} numberOfLines={1}>
                      {String(pa.nome ?? `PA #${pa.id}`)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            <AppButton
              label="Próximo"
              onPress={() => {
                if (!paId) { showError('Selecione um PA'); return; }
                setStep('selecao');
                void searchItems();
              }}
              disabled={!paId}
              style={{ marginTop: 8 }}
            />
          </ScrollView>
        )}

        {/* ── STEP 2: SELECTION ───────────────────────────── */}
        {step === 'selecao' && (
          <View style={styles.flex}>
            <View style={styles.searchBar}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder={tipo === 'VEICULO' ? 'Buscar por placa…' : 'Buscar por nome ou CPF…'}
              />
              <AppButton label="Buscar" variant="secondary" onPress={() => void searchItems()} loading={searchLoading} style={{ paddingVertical: 10 }} />
            </View>

            {selected.size > 0 && (
              <View style={styles.selectedBar}>
                <Ionicons name="checkmark-circle" size={18} color={colors.gateYellow} />
                <Text style={styles.selectedText}>{selected.size} selecionado(s)</Text>
                <Pressable onPress={() => setSelected(new Set())}>
                  <Text style={styles.clearText}>Limpar</Text>
                </Pressable>
              </View>
            )}

            {items.length === 0 && !searchLoading ? (
              <EmptyState icon="search-outline" title="Busque registros" subtitle="Use a barra de busca acima." />
            ) : (
              <FlatList
                data={items}
                keyExtractor={(item, i) => String(item.id ?? i)}
                renderItem={({ item }) => {
                  const id = String(item.id);
                  const isSelected = selected.has(id);
                  return (
                    <Pressable style={[styles.item, isSelected && styles.itemSelected]} onPress={() => toggleItem(id)}>
                      {tipo !== 'VEICULO' ? (
                        <Avatar name={itemLabel(item)} size={40} />
                      ) : (
                        <View style={styles.carIcon}><Ionicons name="car-sport" size={20} color={colors.info2} /></View>
                      )}
                      <View style={styles.itemText}>
                        <Text style={styles.itemTitle} numberOfLines={1}>{itemLabel(item)}</Text>
                        {itemSub(item) ? <Text style={styles.itemSub}>{itemSub(item)}</Text> : null}
                      </View>
                      <Ionicons name={isSelected ? 'checkbox' : 'square-outline'} size={24} color={isSelected ? colors.success : colors.gray400} />
                    </Pressable>
                  );
                }}
              />
            )}

            <View style={styles.bottomBar}>
              <AppButton label="Voltar" variant="ghost" onPress={() => setStep('config')} style={styles.halfBtn} />
              <AppButton
                label="Próximo"
                onPress={() => {
                  if (selected.size === 0) { showError('Selecione ao menos 1'); return; }
                  setStep('confirmacao');
                }}
                style={styles.halfBtn}
              />
            </View>
          </View>
        )}

        {/* ── STEP 3: CONFIRM ─────────────────────────────── */}
        {step === 'confirmacao' && (
          <ScrollView contentContainerStyle={styles.pad}>
            <Text style={styles.title}>Confirmar envio</Text>

            <View style={styles.summaryCard}>
              <SummaryRow label="Processo" value={contexto === 'ENVIAR_CONVITE' ? 'Enviar convite' : 'Liberar acesso'} />
              <SummaryRow label="Tipo" value={tipo} />
              <SummaryRow label="Período" value={`${periodo === 'hoje' ? 'Hoje' : 'Amanhã'} (${formatDate(periodo)})`} />
              <SummaryRow label="PA" value={`#${paId}`} />
              <SummaryRow label="Selecionados" value={`${selected.size} item(s)`} />
            </View>

            <AppButton
              label={contexto === 'ENVIAR_CONVITE' ? 'Enviar convite' : 'Liberar acesso'}
              onPress={() => void handleSend()}
              loading={sending}
              icon={<Ionicons name="send" size={18} color={colors.primary} />}
              style={{ marginTop: 16 }}
            />
            <AppButton label="Voltar" variant="ghost" onPress={() => setStep('selecao')} />
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </ProtectedScreen>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bgPrimary },
  pad: { padding: 20, paddingBottom: 40 },
  stepBar: { flexDirection: 'row', justifyContent: 'center', gap: 20, paddingVertical: 14, backgroundColor: colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: colors.border },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gray200, alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: colors.gateYellow },
  stepNum: { fontSize: 13, fontWeight: '700', color: colors.gray500 },
  stepNumActive: { color: colors.primary },
  stepLabel: { fontSize: 11, color: colors.gray500 },
  stepLabelActive: { color: colors.textPrimary, fontWeight: '600' },
  section: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  chip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.bgSecondary },
  chipActive: { borderColor: colors.gateYellow, backgroundColor: 'rgba(249,199,6,0.08)' },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.gray600 },
  chipTextActive: { color: colors.primary },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 2, borderColor: colors.border, marginBottom: 8, backgroundColor: colors.bgSecondary },
  optionActive: { borderColor: colors.gateYellow, backgroundColor: 'rgba(249,199,6,0.08)' },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  optionTextActive: { color: colors.primary },
  paChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.gray200, marginRight: 8 },
  paChipActive: { backgroundColor: colors.gateYellow },
  paChipText: { fontSize: 13, color: colors.textPrimary, maxWidth: 150 },
  paChipTextActive: { color: colors.primary, fontWeight: '700' },
  searchBar: { paddingHorizontal: 16, paddingTop: 12, gap: 8, backgroundColor: colors.bgSecondary, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8 },
  selectedBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: colors.primary },
  selectedText: { flex: 1, color: colors.gateYellow, fontWeight: '600', fontSize: 14 },
  clearText: { color: colors.gray400, fontSize: 13 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  itemSelected: { backgroundColor: 'rgba(39,174,96,0.06)' },
  carIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#e3f2fd', alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  itemSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  bottomBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bgSecondary },
  halfBtn: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 16 },
  summaryCard: { backgroundColor: colors.bgSecondary, borderRadius: 14, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.border },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
});
