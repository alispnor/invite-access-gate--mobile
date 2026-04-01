import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { apiPublicGet } from '../../../api/client';
import { ProtectedScreen } from '../../../auth/ProtectedScreen';
import type { InicioStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';

type Props = NativeStackScreenProps<
  InicioStackParamList,
  'TermoPublicHome'
>;

/**
 * API pública (sem Bearer). O utilizador pode colar o hash do convite.
 * Rota web opcional: termo-convite-publico/hash/:hash
 */
export function TermoConvitePublicoScreen({ route }: Props) {
  const initial = route.params?.hash ?? '';
  const [hash, setHash] = useState(initial);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConvidado = async () => {
    const h = hash.trim();
    if (!h) {
      setError('Informe o hash');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const data = await apiPublicGet<unknown>(`/convidado/hash/${encodeURIComponent(h)}`);
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ProtectedScreen>
      <View style={styles.root}>
        <Text style={styles.title}>Convidado público</Text>
        <Text style={styles.hint}>
          GET /convidado/hash/:hash na API pública (sem token).
        </Text>
        <Text style={styles.label}>Hash</Text>
        <TextInput
          value={hash}
          onChangeText={setHash}
          placeholder="hash do convite"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
        />
        <Pressable
          style={styles.btn}
          onPress={() => void fetchConvidado()}
          disabled={busy}
        >
          <Text style={styles.btnLabel}>
            {busy ? 'A carregar…' : 'Consultar'}
          </Text>
        </Pressable>
        {error ? <Text style={styles.err}>{error}</Text> : null}
        {result ? (
          <Text selectable style={styles.mono}>
            {result}
          </Text>
        ) : null}
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.bgPrimary,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: colors.bgSecondary,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnLabel: { color: colors.gateYellow, fontWeight: '600' },
  err: { color: colors.danger, marginBottom: 8 },
  mono: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: colors.textPrimary,
  },
});
