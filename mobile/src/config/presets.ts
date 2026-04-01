import type { AppEnvironment, AppEnvName } from './appEnvironment.types';

/**
 * Presets alinhados 1:1 com `frontend/app/src/environments/environment*.ts`.
 *
 * clientId:
 *   Usa os mesmos clientes do Angular (portaria-frontend / localhost-frontend).
 *   Para funcionar no mobile, adicionar `gateportaria://oauth` nos
 *   Valid Redirect URIs do cliente no Keycloak.
 *   O .env pode sobrescrever via EXPO_PUBLIC_KEYCLOAK_CLIENT_ID.
 *
 * Para trocar de ambiente: copie o .env correspondente:
 *   cp .env.dev .env   (desenvolvimento)
 *   cp .env.hom .env   (homologação)
 *   cp .env.prod .env  (produção)
 */
export const ENVIRONMENT_PRESETS: Record<AppEnvName, Omit<AppEnvironment, 'apiPublicUrl'>> = {
  // ── environment.ts (local) ────────────────────────────────────
  local: {
    production: false,
    local: true,
    url: 'http://localhost:3000/api/private',
    keycloakParams: {
      realm: 'gate',
      url: 'https://dev.login.gate.com.br',
      clientId: 'localhost-frontend',
    },
  },
  // ── environment.dev.ts ────────────────────────────────────────
  dev: {
    production: false,
    local: false,
    url: 'https://dev.api.portaria.gate.com.br/api/private',
    keycloakParams: {
      realm: 'gate',
      url: 'https://dev.login.gate.com.br',
      clientId: 'portaria-frontend',
    },
  },
  // ── environment.hom.ts ────────────────────────────────────────
  hom: {
    production: false,
    local: false,
    url: 'https://hom.api.portaria.gate.com.br/api/private',
    keycloakParams: {
      realm: 'gatetech',
      url: 'https://homologacao.sso.gatetech.com.br',
      clientId: 'portaria-frontend',
    },
  },
  // ── environment.prod.ts ───────────────────────────────────────
  prod: {
    production: true,
    local: false,
    url: 'https://api.portaria.gate.com.br/api/private',
    keycloakParams: {
      realm: 'gate',
      url: 'https://login.gate.com.br',
      clientId: 'portaria-frontend',
    },
  },
};

export function deriveApiPublicUrl(privateBase: string): string {
  if (!privateBase) return '';
  return privateBase.replace(/\/private\/?$/, '/public');
}
