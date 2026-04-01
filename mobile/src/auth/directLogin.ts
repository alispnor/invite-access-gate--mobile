import { getEnvironment, getIssuerUrl } from '../config/env';

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

/**
 * Login direto via grant_type=password (Resource Owner Password Credentials).
 * Usa o mesmo endpoint que o web usa para trocar code por token.
 * Não precisa de redirect URI.
 */
export async function loginWithPassword(
  username: string,
  password: string
): Promise<TokenResponse> {
  const issuer = getIssuerUrl();
  const { keycloakParams } = getEnvironment();
  const tokenUrl = `${issuer}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: keycloakParams.clientId,
    username,
    password,
    scope: 'openid profile email',
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `HTTP ${res.status}`;
    try {
      const json = JSON.parse(text);
      msg = json.error_description || json.error || msg;
    } catch {
      // use default msg
    }
    throw new Error(msg);
  }

  return res.json() as Promise<TokenResponse>;
}

/**
 * Refresh token exchange — não precisa de redirect URI.
 * Pode ser usado com refresh_token copiado do browser.
 */
export async function refreshWithToken(
  refreshToken: string
): Promise<TokenResponse> {
  const issuer = getIssuerUrl();
  const { keycloakParams } = getEnvironment();
  const tokenUrl = `${issuer}/protocol/openid-connect/token`;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: keycloakParams.clientId,
    refresh_token: refreshToken,
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = `HTTP ${res.status}`;
    try {
      const json = JSON.parse(text);
      msg = json.error_description || json.error || msg;
    } catch {
      // use default msg
    }
    throw new Error(msg);
  }

  return res.json() as Promise<TokenResponse>;
}
