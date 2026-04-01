import Constants from 'expo-constants';
import type { AppEnvironment, AppEnvName } from './appEnvironment.types';
import { ENVIRONMENT_PRESETS, deriveApiPublicUrl } from './presets';

/**
 * Extra bruto vindo de `app.config.ts` / variáveis `EXPO_PUBLIC_*`.
 */
export type ExpoExtra = {
  appEnv?: string;
  apiBaseUrl?: string;
  apiPublicUrl?: string;
  keycloakUrl?: string;
  keycloakRealm?: string;
  keycloakClientId?: string;
  tenantId?: string;
  production?: string | boolean;
  local?: string | boolean;
};

export function getAppExtra(): ExpoExtra {
  return (Constants.expoConfig?.extra ?? {}) as ExpoExtra;
}

function isAppEnvName(v: string): v is AppEnvName {
  return v === 'local' || v === 'dev' || v === 'hom' || v === 'prod';
}

/**
 * Configuração efetiva alinhada ao objeto `environment` do Angular
 * (`url`, `keycloakParams`, `production`, `local`, `apiPublicUrl`).
 *
 * - Com `EXPO_PUBLIC_APP_ENV=local|dev|hom|prod` aplicam-se URLs/realm do preset
 *   (ver `presets.ts` ↔ `frontend/app/src/environments`).
 * - `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_KEYCLOAK_*` sobrepõem o preset.
 */
export function getEnvironment(): AppEnvironment {
  const e = getAppExtra();
  const flavorRaw = (e.appEnv ?? '').toLowerCase().trim();
  const preset =
    flavorRaw && isAppEnvName(flavorRaw)
      ? ENVIRONMENT_PRESETS[flavorRaw]
      : null;

  const url =
    (typeof e.apiBaseUrl === 'string' && e.apiBaseUrl.trim()) ||
    preset?.url ||
    '';

  const kcBase = (
    (typeof e.keycloakUrl === 'string' && e.keycloakUrl.trim()) ||
    preset?.keycloakParams.url ||
    ''
  ).replace(/\/$/, '');

  const realm =
    (typeof e.keycloakRealm === 'string' && e.keycloakRealm.trim()) ||
    preset?.keycloakParams.realm ||
    '';

  const clientId =
    (typeof e.keycloakClientId === 'string' && e.keycloakClientId.trim()) ||
    preset?.keycloakParams.clientId ||
    '';

  const production =
    e.production === true ||
    e.production === 'true' ||
    (preset?.production ?? false);

  const local =
    e.local === true ||
    e.local === 'true' ||
    (preset?.local ?? false);

  const apiPublicUrl =
    (typeof e.apiPublicUrl === 'string' &&
      e.apiPublicUrl.replace(/\/$/, '')) ||
    deriveApiPublicUrl(url);

  return {
    production,
    local,
    url,
    apiPublicUrl,
    keycloakParams: {
      url: kcBase,
      realm,
      clientId,
    },
  };
}

export function getIssuerUrl(): string {
  const { keycloakParams } = getEnvironment();
  const base = keycloakParams.url.replace(/\/$/, '');
  if (!base || !keycloakParams.realm) return '';
  return `${base}/realms/${keycloakParams.realm}`;
}
