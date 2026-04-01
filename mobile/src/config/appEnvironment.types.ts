/**
 * Espelho semântico de `environment` do Angular (`frontend/app/src/environments`).
 */
export type AppEnvName = 'local' | 'dev' | 'hom' | 'prod';

export interface KeycloakParams {
  realm: string;
  url: string;
  clientId: string;
}

export interface AppEnvironment {
  production: boolean;
  local: boolean;
  /** Base da API privada (`/api/private`), como `environment.url` no Angular. */
  url: string;
  /** Base da API pública; default: `url` com `/private` → `/public`. */
  apiPublicUrl: string;
  keycloakParams: KeycloakParams;
}

/** Regra de acesso (como itens em `accessRules` das rotas Angular). */
export interface AccessRuleItem {
  tipoEntidade: string;
  tipoPerfil: string[];
}
