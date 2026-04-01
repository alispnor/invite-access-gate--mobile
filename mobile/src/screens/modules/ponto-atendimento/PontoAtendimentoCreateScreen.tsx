import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiPost } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { InicioStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<InicioStackParamList, 'PaCreate'>;

type Form = { nome: string; descricao: string; cep: string; logradouro: string; numero: string; complemento: string; bairro: string; cidade: string; uf: string };

export function PontoAtendimentoCreateScreen({ navigation }: Props) {
  const [form, setForm] = useState<Form>({ nome: '', descricao: '', cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [saving, setSaving] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const update = <K extends keyof Form>(key: K, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const fetchCep = async (cep: string) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json() as Record<string, string>;
      if (!data.erro) {
        setForm((p) => ({
          ...p,
          logradouro: data.logradouro ?? p.logradouro,
          bairro: data.bairro ?? p.bairro,
          cidade: data.localidade ?? p.cidade,
          uf: data.uf ?? p.uf,
        }));
      }
    } catch { /* ViaCEP offline */ }
    finally { setCepLoading(false); }
  };

  const handleSave = async () => {
    const errs: typeof errors = {};
    if (!form.nome.trim()) errs.nome = 'Nome obrigatório';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      await apiPost('/ponto-atendimento', {
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || undefined,
        cep: form.cep.replace(/\D/g, '') || undefined,
        logradouro: form.logradouro || undefined,
        numero: form.numero || undefined,
        complemento: form.complemento || undefined,
        bairro: form.bairro || undefined,
        cidade: form.cidade || undefined,
        uf: form.uf || undefined,
      });
      showSuccess('PA criado com sucesso');
      navigation.goBack();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.PONTO_ATENDIMENTO_CREATE}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppTextInput label="Nome" value={form.nome} onChangeText={(v) => update('nome', v)} placeholder="Nome do PA" error={errors.nome} required />
          <AppTextInput label="Descrição" value={form.descricao} onChangeText={(v) => update('descricao', v)} multiline />
          <AppTextInput label="CEP" value={form.cep} onChangeText={(v) => { const f = formatCep(v); update('cep', f); if (f.replace(/\D/g, '').length === 8) void fetchCep(f); }} placeholder="00000-000" keyboardType="numeric" maxLength={9} />
          {cepLoading ? <AppButton label="Buscando CEP…" variant="ghost" onPress={() => {}} loading /> : null}
          <AppTextInput label="Logradouro" value={form.logradouro} onChangeText={(v) => update('logradouro', v)} />
          <View style={styles.row}>
            <AppTextInput label="Número" value={form.numero} onChangeText={(v) => update('numero', v)} keyboardType="numeric" style={styles.half} />
            <AppTextInput label="Complemento" value={form.complemento} onChangeText={(v) => update('complemento', v)} style={styles.half} />
          </View>
          <AppTextInput label="Bairro" value={form.bairro} onChangeText={(v) => update('bairro', v)} />
          <View style={styles.row}>
            <AppTextInput label="Cidade" value={form.cidade} onChangeText={(v) => update('cidade', v)} style={styles.cityField} />
            <AppTextInput label="UF" value={form.uf} onChangeText={(v) => update('uf', v.toUpperCase().slice(0, 2))} maxLength={2} autoCapitalize="characters" style={styles.ufField} />
          </View>
          <View style={styles.buttonRow}>
            <AppButton label="Salvar" onPress={() => void handleSave()} loading={saving} icon={<Ionicons name="checkmark-circle" size={20} color={colors.primary} />} />
            <AppButton label="Cancelar" variant="outline" onPress={() => navigation.goBack()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { padding: 20, paddingBottom: 40 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  cityField: { flex: 2 },
  ufField: { flex: 1 },
  buttonRow: { gap: 12, marginTop: 8 },
});
