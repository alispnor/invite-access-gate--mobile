import { useCallback, useState } from 'react';
import type { AccessRuleItem } from '../config/appEnvironment.types';
import { checkPermission } from './accessRules';
import { useAuth } from './AuthContext';

/**
 * Carrega o perfil (se necessário) e indica se as regras passam.
 * Útil para condicionar botões ou secções sem bloquear o ecrã inteiro.
 */
export function useCanAccess(accessRules: AccessRuleItem[] | null | undefined) {
  const { userProfile, loadUserProfile } = useAuth();
  const [checking, setChecking] = useState(false);

  const canAccess = useCallback(async () => {
    if (accessRules == null || accessRules.length === 0) {
      return true;
    }
    setChecking(true);
    try {
      const profile = await loadUserProfile(false);
      return checkPermission(profile, accessRules);
    } finally {
      setChecking(false);
    }
  }, [accessRules, loadUserProfile]);

  const allowedSync =
    accessRules == null || accessRules.length === 0
      ? true
      : checkPermission(userProfile, accessRules);

  return { canAccess, allowedSync, checking };
}
