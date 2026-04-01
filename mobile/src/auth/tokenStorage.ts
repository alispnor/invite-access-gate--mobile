import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS = 'gate_access_token';
const REFRESH = 'gate_refresh_token';
const EXPIRES = 'gate_expires_at';

export async function saveTokens(params: {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
}): Promise<void> {
  await AsyncStorage.setItem(ACCESS, params.accessToken);
  if (params.refreshToken) {
    await AsyncStorage.setItem(REFRESH, params.refreshToken);
  }
  if (params.expiresIn != null) {
    const at = Date.now() + params.expiresIn * 1000 - 60_000;
    await AsyncStorage.setItem(EXPIRES, String(at));
  }
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS, REFRESH, EXPIRES]);
}

export async function isAccessExpired(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(EXPIRES);
  if (!raw) return false;
  return Date.now() > Number(raw);
}
