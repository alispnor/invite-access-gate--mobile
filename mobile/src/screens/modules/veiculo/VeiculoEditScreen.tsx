import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiDelete, apiGet, apiPut } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<CadastroStackParamList, 'VeiculoEdit'>;
type FormState = { placa: string; marca: string; modelo: string; cor: string; ano_modelo: string };

export function VeiculoEditScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({ placa: '', marca: '', modelo: '', cor: '', ano_modelo: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiGet<Record<string, unknown>>(`/veiculo/${id}`);
      const d = (res as { data?: Record<string, unknown> }).data ?? res;
      setForm({
        placa: String(d.placa ?? ''),
        marca: String(d.marca ?? ''),
        modelo: String(d.modelo ?? ''),
        cor: String(d.cor ?? ''),
        ano_modelo: String(d.ano_modelo ?? ''),
      });
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void fetchData(); }, [fetchData]);

  const update = <K extends keyof FormState>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    if (!form.placa.trim()) { setErrors({ placa: 'Placa obrigatória' }); return; }
    setSaving(true);
    try {
      await apiPut(`/veiculos/${id}`, {
        placa: form.placa,
        marca: form.marca || undefined,
        modelo: form.modelo || undefined,
        cor: form.cor || undefined,
        ano_modelo: form.ano_modelo || undefined,
      });
      showSuccess('Veículo atualizado');
      navigation.goBack();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir veículo', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try { await apiDelete(`/veiculo/${id}`); showSuccess('Veículo excluído'); navigation.goBack(); }
          catch (e) { showError(e instanceof Error ? e.message : 'Erro ao excluir'); }
        },
      },
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.VEHICLE_EDIT}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppTextInput label="Placa" value={form.placa} onChangeText={(v) => update('placa', v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7))} error={errors.placa} autoCapitalize="characters" maxLength={7} required />
          <AppTextInput label="Marca" value={form.marca} onChangeText={(v) => update('marca', v)} autoCapitalize="words" />
          <AppTextInput label="Modelo" value={form.modelo} onChangeText={(v) => update('modelo', v)} autoCapitalize="words" />
          <AppTextInput label="Cor" value={form.cor} onChangeText={(v) => update('cor', v)} autoCapitalize="words" />
          <AppTextInput label="Ano/Modelo" value={form.ano_modelo} onChangeText={(v) => update('ano_modelo', v.replace(/\D/g, '').slice(0, 4))} keyboardType="numeric" maxLength={4} />
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
  buttonRow: { gap: 12, marginTop: 8 },
});
