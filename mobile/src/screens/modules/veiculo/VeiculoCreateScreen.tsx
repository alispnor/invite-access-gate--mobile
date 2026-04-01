import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiPost } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<CadastroStackParamList, 'VeiculoCreate'>;

type FormState = { placa: string; marca: string; modelo: string; cor: string; ano_modelo: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

function formatPlaca(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
}

export function VeiculoCreateScreen({ navigation }: Props) {
  const [form, setForm] = useState<FormState>({ placa: '', marca: '', modelo: '', cor: '', ano_modelo: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs: FormErrors = {};
    if (!form.placa.trim()) errs.placa = 'Placa é obrigatória';
    else if (form.placa.length < 7) errs.placa = 'Placa deve ter 7 caracteres';
    if (Object.keys(errs).length > 0) { setErrors(errs); showError('Corrija os campos destacados'); return; }

    setSaving(true);
    try {
      await apiPost('/veiculos/incluir', {
        placa: form.placa,
        marca: form.marca || undefined,
        modelo: form.modelo || undefined,
        cor: form.cor || undefined,
        ano_modelo: form.ano_modelo || undefined,
      });
      showSuccess('Veículo criado com sucesso');
      navigation.goBack();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.VEHICLE_CREATE}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <AppTextInput label="Placa" value={form.placa} onChangeText={(v) => update('placa', formatPlaca(v))} placeholder="ABC1D23" error={errors.placa} autoCapitalize="characters" maxLength={7} required />
          <AppTextInput label="Marca" value={form.marca} onChangeText={(v) => update('marca', v)} placeholder="Ex: Toyota" autoCapitalize="words" />
          <AppTextInput label="Modelo" value={form.modelo} onChangeText={(v) => update('modelo', v)} placeholder="Ex: Corolla" autoCapitalize="words" />
          <AppTextInput label="Cor" value={form.cor} onChangeText={(v) => update('cor', v)} placeholder="Ex: Branco" autoCapitalize="words" />
          <AppTextInput label="Ano/Modelo" value={form.ano_modelo} onChangeText={(v) => update('ano_modelo', v.replace(/\D/g, '').slice(0, 4))} placeholder="2024" keyboardType="numeric" maxLength={4} />

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
  buttonRow: { gap: 12, marginTop: 8 },
});
