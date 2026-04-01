import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
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
import { apiPostFormData } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import { AppButton, AppTextInput } from '../../../components';
import { ROUTE_ACCESS_RULES } from '../../../config/routeAccessRules';
import type { CadastroStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { showError, showSuccess } from '../../../utils/toast';

type Props = NativeStackScreenProps<CadastroStackParamList, 'PessoaCreate'>;

type FormState = {
  nome: string;
  cpf: string;
  celular: string;
  email: string;
  cnh: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.nome.trim()) errors.nome = 'Nome é obrigatório';
  if (!form.cpf.trim()) {
    errors.cpf = 'CPF é obrigatório';
  } else if (form.cpf.replace(/\D/g, '').length !== 11) {
    errors.cpf = 'CPF deve ter 11 dígitos';
  }
  if (form.celular && form.celular.replace(/\D/g, '').length < 10) {
    errors.celular = 'Celular inválido';
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido';
  }
  return errors;
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function PessoaCreateScreen({ navigation }: Props) {
  const [form, setForm] = useState<FormState>({
    nome: '',
    cpf: '',
    celular: '',
    email: '',
    cnh: '',
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showError('Permissão de câmera necessária');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showError('Permissão de galeria necessária');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Corrija os campos destacados');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nome', form.nome.trim());
      formData.append('cpf', form.cpf.replace(/\D/g, ''));
      if (form.celular) formData.append('celular', form.celular.replace(/\D/g, ''));
      if (form.email) formData.append('email', form.email.trim());
      if (form.cnh) formData.append('cnh', form.cnh.trim());

      if (photo) {
        const filename = photo.split('/').pop() ?? 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('foto', {
          uri: photo,
          name: filename,
          type,
        } as unknown as Blob);
      }

      await apiPostFormData('/pessoa/create', formData);
      showSuccess('Pessoa criada com sucesso');
      navigation.goBack();
    } catch (e) {
      showError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedScreen accessRules={ROUTE_ACCESS_RULES.PERSON_CREATE}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo section */}
          <View style={styles.photoSection}>
            <Pressable style={styles.photoCircle} onPress={pickImage}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={32} color={colors.gray400} />
                  <Text style={styles.photoText}>Foto</Text>
                </View>
              )}
            </Pressable>
            <View style={styles.photoActions}>
              <Pressable style={styles.photoBtn} onPress={pickImage}>
                <Ionicons name="camera-outline" size={20} color={colors.info2} />
                <Text style={styles.photoBtnLabel}>Câmera</Text>
              </Pressable>
              <Pressable style={styles.photoBtn} onPress={pickFromGallery}>
                <Ionicons name="images-outline" size={20} color={colors.info2} />
                <Text style={styles.photoBtnLabel}>Galeria</Text>
              </Pressable>
              {photo && (
                <Pressable style={styles.photoBtn} onPress={() => setPhoto(null)}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  <Text style={[styles.photoBtnLabel, { color: colors.danger }]}>Remover</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Form fields */}
          <AppTextInput
            label="Nome completo"
            value={form.nome}
            onChangeText={(v) => update('nome', v)}
            placeholder="Ex: João da Silva"
            error={errors.nome}
            autoCapitalize="words"
            required
          />

          <AppTextInput
            label="CPF"
            value={form.cpf}
            onChangeText={(v) => update('cpf', formatCpf(v))}
            placeholder="000.000.000-00"
            error={errors.cpf}
            keyboardType="numeric"
            maxLength={14}
            required
          />

          <AppTextInput
            label="Celular"
            value={form.celular}
            onChangeText={(v) => update('celular', formatPhone(v))}
            placeholder="(00) 00000-0000"
            error={errors.celular}
            keyboardType="phone-pad"
            maxLength={15}
          />

          <AppTextInput
            label="Email"
            value={form.email}
            onChangeText={(v) => update('email', v)}
            placeholder="email@exemplo.com"
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppTextInput
            label="CNH"
            value={form.cnh}
            onChangeText={(v) => update('cnh', v)}
            placeholder="Número da CNH"
            keyboardType="numeric"
            maxLength={11}
          />

          <View style={styles.buttonRow}>
            <AppButton
              label="Salvar"
              onPress={() => void handleSave()}
              loading={saving}
              icon={<Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
            />
            <AppButton
              label="Cancelar"
              variant="outline"
              onPress={() => navigation.goBack()}
            />
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
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: colors.gray200,
    borderWidth: 3,
    borderColor: colors.gateYellow,
  },
  photoImage: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoBtnLabel: {
    fontSize: 13,
    color: colors.info2,
    fontWeight: '500',
  },
  buttonRow: { gap: 12, marginTop: 8 },
});
