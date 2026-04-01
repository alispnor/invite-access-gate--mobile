import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'GATE Portaria',
  slug: 'gate-portaria-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  scheme: 'gateportaria',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#000000',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.gate.portaria',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#000000',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'com.gate.portaria',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    /** `local` | `dev` | `hom` | `prod` — espelha `environment.*.ts` do Angular (ver `src/config/presets.ts`). */
    appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? '',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
    apiPublicUrl: process.env.EXPO_PUBLIC_API_PUBLIC_URL ?? '',
    keycloakUrl: process.env.EXPO_PUBLIC_KEYCLOAK_URL ?? '',
    keycloakRealm: process.env.EXPO_PUBLIC_KEYCLOAK_REALM ?? '',
    keycloakClientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
    tenantId: process.env.EXPO_PUBLIC_TENANT_ID ?? '',
    production: process.env.EXPO_PUBLIC_PRODUCTION === 'true',
    local: process.env.EXPO_PUBLIC_LOCAL === 'true',
  },
};

export default config;
