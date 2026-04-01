import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { getEnvironment } from '../config/env';
import type { AccessRuleItem } from '../config/appEnvironment.types';
import { checkPermission } from './accessRules';
import { useAuth } from './AuthContext';
import { colors } from '../theme/colors';

type Props = {
  /** `null` ou omitido = só autenticado (como `HOME` no Angular). */
  accessRules?: AccessRuleItem[] | null;
  children: React.ReactNode;
};

/**
 * Equivalente ao `AuthGuard` + `accessRules`: após montar, carrega o perfil Keycloak
 * e verifica permissão; se negado, alerta e faz `logout` exceto em `environment.local`.
 */
export function ProtectedScreen({ accessRules, children }: Props) {
  const { loadUserProfile, signOut } = useAuth();
  const [forbiddenLocal, setForbiddenLocal] = useState(false);

  useEffect(() => {
    if (accessRules == null || accessRules.length === 0) {
      setForbiddenLocal(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      const profile = await loadUserProfile(true);
      if (cancelled) return;

      const allowed = checkPermission(profile, accessRules);
      if (!allowed) {
        const env = getEnvironment();
        Alert.alert(
          'Acesso negado',
          'Você não tem permissão para acessar este recurso.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (!env.local) {
                  void signOut();
                } else {
                  setForbiddenLocal(true);
                }
              },
            },
          ],
          { cancelable: false }
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessRules, loadUserProfile, signOut]);

  if (forbiddenLocal) {
    return (
      <View style={styles.blocked}>
        <Text style={styles.blockedText}>
          Sem permissão para este conteúdo (modo local: sessão mantida).
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  blocked: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: colors.gray100,
  },
  blockedText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
