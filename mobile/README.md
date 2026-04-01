#  Portaria — app mobile (Expo + React Native + TypeScript)

MVP: login com **Keycloak** (OAuth2 + PKCE), tema escuro, cliente HTTP com **Bearer**, ambientes alinhados ao Angular e **guards** equivalentes ao `AuthGuard` + `accessRules`.

## Pre-requisitos

- Node 20+
- Keycloak: cliente **publico** para mobile (**Standard flow**, **PKCE S256**, redirect nativo). O **`clientId` do mobile e distinto** do web (`portaria-frontend` / `localhost-frontend`): o realm e a URL do servidor devem ser os **mesmos** por ambiente; so o cliente OIDC muda.

### Redirect URI (Keycloak)

Scheme: `gateportaria` (ver `app.config.ts`). Ex.: `gateportaria://oauth`. Com Expo Go, registe tambem as URIs que o Metro mostrar.

## Configuracao

```bash
cp .env.example .env
```

Defina no minimo `EXPO_PUBLIC_APP_ENV` e `EXPO_PUBLIC_KEYCLOAK_CLIENT_ID`.

## Ambientes: Angular <-> mobile

| `EXPO_PUBLIC_APP_ENV` | Ficheiro Angular | `url` (API privada) | Keycloak (preset) |
|------------------------|------------------|---------------------|-------------------|
| `local` | `environment.ts` | `http://localhost:3000/api/private` | realm `gate`, `https://dev.login.gate.com.br` |
| `dev` | `environment.dev.ts` | `https://dev.api.portaria.gate.com.br/api/private` | realm `gate`, `https://dev.login.gate.com.br` |
| `hom` | `environment.hom.ts` | `https://hom.api.portaria.gate.com.br/api/private` | realm `gatetech`, `https://homologacao.sso.gatetech.com.br` |
| `prod` | `environment.prod.ts` | `https://api.portaria.gate.com.br/api/private` | realm `gate`, `https://login.gate.com.br` |

Valores em codigo: [src/config/presets.ts](src/config/presets.ts). Pode sobrescrever com `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_KEYCLOAK_URL`, `EXPO_PUBLIC_KEYCLOAK_REALM`. A API publica usa `EXPO_PUBLIC_API_PUBLIC_URL` ou deriva de `url` trocando `/private` por `/public`.

Flags opcionais: `EXPO_PUBLIC_PRODUCTION`, `EXPO_PUBLIC_LOCAL` (comportamento alinhado ao `environment` Angular, ex. logout apos negacao de permissao).

## Comandos

```bash
npm install
npm run start
# npm run android | npm run ios
```

## Estrutura

- `src/config/env.ts` — `getEnvironment()` (espelho de `environment`)
- `src/config/presets.ts` — presets por flavor
- `src/config/routeAccessRules.ts` — regras portadas de `route-access-rules.config.ts`
- `src/auth/AuthContext.tsx` — OIDC + perfil UserInfo (fallback JWT)
- `src/auth/accessRules.ts` — `checkPermission` (porta `AccessRulesService`)
- `src/auth/ProtectedScreen.tsx` — guard por ecra (`useFocusEffect` + alerta + logout se `!local`)
- `src/auth/useCanAccess.ts` — verificacao opcional sem bloquear o ecra
- `src/api/client.ts` — usa `getEnvironment().url`
- `src/theme/colors.ts`, `src/models/` — como antes

## Seguranca

Nao commite `.env`. O `clientId` publico nao e segredo; redirects e realm devem coincidir com o Keycloak.
