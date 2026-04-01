import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiDelete, apiGet, apiPutFormData } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<CadastroStackParamList, 'PessoaEdit'>;

type FormState = {
  nome: string;
  cpf: string;
  celular: string;
  email: string;
  cnh: string;
};

function formatCpf(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function PessoaEditScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({ nome: '', cpf: '', celular: '', email: '', cnh: '' });
  const [photo, setPhoto] = useState<string | null>(null);
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await apiGet<Record<string, unknown>>(`/pessoa/${id}`);
      const data = (res as { data?: Record<string, unknown> }).data ?? res;
      setForm({
        nome: String(data.nome ?? ''),
        cpf: formatCpf(String(data.cpf ?? '')),
        celular: data.celular ? formatPhone(String(data.celular)) : '',
        email: String(data.email ?? ''),
        cnh: String(data.cnh ?? ''),
      });
      if (typeof data.fotoUrl === 'string' && data.fotoUrl) setPhoto(data.fotoUrl);
      else if (typeof data.foto === 'string' && data.foto) setPhoto(data.foto);
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

  const pickImage = async (source: 'camera' | 'gallery') => {
    const perm = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { showError('Permissão necessária'); return; }

    const fn = source === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const result = await fn({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled && result.assets[0]) setNewPhoto(result.assets[0].uri);
  };

  const handleSave = async () => {
    const errs: typeof errors = {};
    if (!form.nome.trim()) errs.nome = 'Nome obrigatório';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nome', form.nome.trim());
      fd.append('cpf', form.cpf.replace(/\D/g, ''));
      if (form.celular) fd.append('celular', form.celular.replace(/\D/g, ''));
      if (form.email) fd.append('email', form.email.trim());
      if (form.cnh) fd.append('cnh', form.cnh.trim());

      if (newPhoto) {
        const filename = newPhoto.split('/').pop() ?? 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        fd.append('foto', { uri: newPhoto, name: filename, type } as unknown as Blob);
      }

      await apiPutFormData(`/pessoa/${id}`, fd);
      showSuccess('Pessoa atualizada');
      navigation.goBack();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Excluir pessoa', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDelete(`/pessoa/${id}`);
            showSuccess('Pessoa excluída');
            navigation.goBack();
          } catch (e) {
            showError(e instanceof Error ? e.message : 'Erro ao excluir');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const displayPhoto = newPhoto ?? photo;

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.PERSON_EDIT}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Photo */}
          <View style={styles.photoSection}>
            <Pressable style={styles.photoCircle} onPress={() => void pickImage('camera')}>
              {displayPhoto ? (
                <Image source={{ uri: displayPhoto }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={32} color={colors.gray400} />
                </View>
              )}
            </Pressable>
            <View style={styles.photoActions}>
              <Pressable style={styles.photoBtn} onPress={() => void pickImage('camera')}>
                <Ionicons name="camera-outline" size={18} color={colors.info2} />
                <Text style={styles.photoBtnLabel}>Câmera</Text>
              </Pressable>
              <Pressable style={styles.photoBtn} onPress={() => void pickImage('gallery')}>
                <Ionicons name="images-outline" size={18} color={colors.info2} />
                <Text style={styles.photoBtnLabel}>Galeria</Text>
              </Pressable>
            </View>
          </View>

          <AppTextInput label="Nome completo" value={form.nome} onChangeText={(v) => update('nome', v)} error={errors.nome} autoCapitalize="words" required />
          <AppTextInput label="CPF" value={form.cpf} onChangeText={(v) => update('cpf', formatCpf(v))} keyboardType="numeric" maxLength={14} editable={false} />
          <AppTextInput label="Celular" value={form.celular} onChangeText={(v) => update('celular', formatPhone(v))} keyboardType="phone-pad" maxLength={15} />
          <AppTextInput label="Email" value={form.email} onChangeText={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
          <AppTextInput label="CNH" value={form.cnh} onChangeText={(v) => update('cnh', v)} keyboardType="numeric" maxLength={11} />

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
  photoSection: { alignItems: 'center', marginBottom: 24 },
  photoCircle: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden', backgroundColor: colors.gray200, borderWidth: 3, borderColor: colors.gateYellow },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  photoActions: { flexDirection: 'row', gap: 16, marginTop: 12 },
  photoBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  photoBtnLabel: { fontSize: 13, color: colors.info2, fontWeight: '500' },
  buttonRow: { gap: 12, marginTop: 8 },
});
