import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiDelete, apiGet, apiPut } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { InicioStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<InicioStackParamList, 'PaEdit'>;
type Form = { nome: string; descricao: string; cep: string; logradouro: string; numero: string; complemento: string; bairro: string; cidade: string; uf: string };

export function PontoAtendimentoEditScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form>({ nome: '', descricao: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiGet<Record<string, unknown>>(`/ponto-atendimento/${id}`);
      const d = (res as { data?: Record<string, unknown> }).data ?? res;
      setForm({
        nome: String(d.nome ?? ''), descricao: String(d.descricao ?? ''),
        cep: String(d.cep ?? ''), logradouro: String(d.logradouro ?? ''),
        numero: String(d.numero ?? ''), complemento: String(d.complemento ?? ''),
        bairro: String(d.bairro ?? ''), cidade: String(d.cidade ?? ''),
        uf: String(d.uf ?? ''),
      });
    } catch (e) { showError(e instanceof Error ? e.message : 'Erro ao carregar'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const update = <K extends keyof Form>(key: K, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const handleSave = async () => {
    if (!form.nome.trim()) { setErrors({ nome: 'Nome obrigatório' }); return; }
    setSaving(true);
    try {
      await apiPut(`/ponto-atendimento/${id}`, {
        nome: form.nome.trim(), descricao: form.descricao.trim() || undefined,
        cep: form.cep.replace(/\D/g, '') || undefined, logradouro: form.logradouro || undefined,
        numero: form.numero || undefined, complemento: form.complemento || undefined,
        bairro: form.bairro || undefined, cidade: form.cidade || undefined, uf: form.uf || undefined,
      });
      showSuccess('PA atualizado'); navigation.goBack();
    } catch (e) { showError(e instanceof Error ? e.message : 'Erro ao salvar'); }
    finally { setSaving(false); }
  };

  const handleDelete = () => {
    Alert.alert('Excluir PA', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
        try { await apiDelete(`/ponto-atendimento/${id}`); showSuccess('PA excluído'); navigation.goBack(); }
        catch (e) { showError(e instanceof Error ? e.message : 'Erro ao excluir'); }
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.PONTO_ATENDIMENTO_EDIT}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppTextInput label="Nome" value={form.nome} onChangeText={(v) => update('nome', v)} error={errors.nome} required />
          <AppTextInput label="Descrição" value={form.descricao} onChangeText={(v) => update('descricao', v)} multiline />
          <AppTextInput label="CEP" value={form.cep} onChangeText={(v) => update('cep', v)} keyboardType="numeric" maxLength={9} />
          <AppTextInput label="Logradouro" value={form.logradouro} onChangeText={(v) => update('logradouro', v)} />
          <View style={styles.row}>
            <AppTextInput label="Número" value={form.numero} onChangeText={(v) => update('numero', v)} style={styles.half} />
            <AppTextInput label="Complemento" value={form.complemento} onChangeText={(v) => update('complemento', v)} style={styles.half} />
          </View>
          <AppTextInput label="Bairro" value={form.bairro} onChangeText={(v) => update('bairro', v)} />
          <View style={styles.row}>
            <AppTextInput label="Cidade" value={form.cidade} onChangeText={(v) => update('cidade', v)} style={{ flex: 2 }} />
            <AppTextInput label="UF" value={form.uf} onChangeText={(v) => update('uf', v.toUpperCase().slice(0, 2))} maxLength={2} style={{ flex: 1 }} />
          </View>
          <View style={styles.buttonRow}>
            <AppButton label="Salvar" onPress={() => void handleSave()} loading={saving} icon={<Ionicons name="checkmark-circle" size={20} color={colors.primary} />} />
            <AppButton label="Excluir" variant="danger" onPress={handleDelete} icon={<Ionicons name="trash" size={18} color="#fff" />} />
            <AppButton label="Cancelar" variant="ghost" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgPrimary },
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  buttonRow: { gap: 12, marginTop: 8 },
});
