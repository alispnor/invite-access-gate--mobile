import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import { colors } from '../theme/colors';

export function LoginScreen() {
  const { signIn, error, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) return;
    void signIn(username.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding */}
        <View style={styles.brand}>
          <Text style={styles.logoText}>GUÉP</Text>
          <View style={styles.accentBar} />
          <Text style={styles.subtitle}>Portaria</Text>
        </View>

        <Text style={styles.hint}>
          Entre com a sua conta institucional.
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuário</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Seu usuário"
              placeholderTextColor={colors.gray500}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.gray500} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha"
              placeholderTextColor={colors.gray500}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.gray500}
              />
            </Pressable>
          </View>
        </View>

        {/* Login button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={isLoading || !username.trim() || !password.trim()}
        >
          {isLoading ? (
            <Text style={styles.buttonLabel}>Entrando...</Text>
          ) : (
            <>
              <Ionicons name="log-in-outline" size={22} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.buttonLabel}>Entrar</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  brand: { marginBottom: 32 },
  logoText: { fontSize: 42, fontWeight: '800', color: colors.textLight, letterSpacing: 2 },
  accentBar: { height: 4, width: 72, backgroundColor: colors.gateYellow, marginTop: 8, marginBottom: 8 },
  subtitle: { fontSize: 22, color: colors.gateYellow, fontWeight: '600' },
  hint: { color: colors.gray400, marginBottom: 24, fontSize: 15, lineHeight: 22 },
  errorBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: 'rgba(231,76,60,0.15)', padding: 12, borderRadius: 10, marginBottom: 16,
  },
  errorText: { color: '#ff6b6b', fontSize: 13, flex: 1, lineHeight: 18 },
  inputGroup: { marginBottom: 16 },
  label: { color: colors.gray400, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  inputIcon: { paddingLeft: 14 },
  input: {
    flex: 1, paddingVertical: 14, paddingHorizontal: 12,
    color: colors.textLight, fontSize: 16,
  },
  eyeBtn: { padding: 14 },
  button: {
    backgroundColor: colors.gateYellow, paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 8,
  },
  buttonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { color: colors.primary, fontSize: 17, fontWeight: '700' },
});
