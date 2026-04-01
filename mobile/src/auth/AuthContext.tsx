import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getEnvironment, getIssuerUrl } from '../config/env';
import type { KeycloakUserProfile } from '../models/keycloak-user';
import { fetchKeycloakUserProfile } from './fetchKeycloakUserProfile';
import { loginWithPassword, refreshWithToken } from './directLogin';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAccessExpired,
  saveTokens,
} from './tokenStorage';

type AuthState = {
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  userProfile: KeycloakUserProfile | null;
  profileLoading: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  loadUserProfile: (force?: boolean) => Promise<KeycloakUserProfile | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    accessToken: null,
    isLoading: true,
    error: null,
    userProfile: null,
    profileLoading: false,
  });

  const userProfileRef = useRef<KeycloakUserProfile | null>(null);
  const issuer = getIssuerUrl();
  const userinfoEndpoint = issuer
    ? `${issuer}/protocol/openid-connect/userinfo`
    : '';

  /* ── refresh tokens ──────────────────────────────────────── */

  const refreshTokens = useCallback(async (): Promise<boolean> => {
    const rt = await getRefreshToken();
    if (!rt) return false;
    try {
      const res = await refreshWithToken(rt);
      await saveTokens({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expiresIn: res.expires_in,
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  /* ── load user profile ───────────────────────────────────── */

  const loadUserProfile = useCallback(
    async (force = false): Promise<KeycloakUserProfile | null> => {
      const token = await getAccessToken();
      if (!token || !userinfoEndpoint) return null;
      if (!force && userProfileRef.current) return userProfileRef.current;
      setState((s) => ({ ...s, profileLoading: true }));
      try {
        const profile = await fetchKeycloakUserProfile(token, userinfoEndpoint);
        userProfileRef.current = profile;
        setState((s) => ({ ...s, userProfile: profile, profileLoading: false }));
        return profile;
      } catch {
        setState((s) => ({ ...s, profileLoading: false }));
        return null;
      }
    },
    [userinfoEndpoint]
  );

  /* ── hydrate on mount ────────────────────────────────────── */

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      const expired = await isAccessExpired();
      if (token && !expired) {
        setState((s) => ({ ...s, accessToken: token, isLoading: false }));
        return;
      }
      if (token && expired) {
        const ok = await refreshTokens();
        if (ok) {
          const t = await getAccessToken();
          setState((s) => ({ ...s, accessToken: t, isLoading: false }));
          return;
        }
      }
      await clearTokens();
      userProfileRef.current = null;
      setState({ accessToken: null, isLoading: false, error: null, userProfile: null, profileLoading: false });
    })();
  }, [refreshTokens]);

  /* ── sign in (username + password) ───────────────────────── */

  const signIn = useCallback(async (username: string, password: string) => {
    setState((s) => ({ ...s, error: null, isLoading: true }));
    try {
      const res = await loginWithPassword(username, password);
      await saveTokens({
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expiresIn: res.expires_in,
      });
      userProfileRef.current = null;
      setState((s) => ({
        ...s,
        accessToken: res.access_token,
        isLoading: false,
        error: null,
        userProfile: null,
      }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Falha no login';
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  }, []);

  /* ── sign out ────────────────────────────────────────────── */

  const signOut = useCallback(async () => {
    await clearTokens();
    userProfileRef.current = null;
    setState({ accessToken: null, isLoading: false, error: null, userProfile: null, profileLoading: false });
  }, []);

  /* ── refresh session ─────────────────────────────────────── */

  const refreshSession = useCallback(async () => {
    const ok = await refreshTokens();
    if (ok) {
      const t = await getAccessToken();
      setState((s) => ({ ...s, accessToken: t }));
    }
    return ok;
  }, [refreshTokens]);

  /* ── context value ───────────────────────────────────────── */

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, signIn, signOut, refreshSession, loadUserProfile }),
    [state, signIn, signOut, refreshSession, loadUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
