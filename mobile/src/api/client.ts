import { getAppExtra, getEnvironment } from '../config/env';
import { getAccessToken, isAccessExpired } from '../auth/tokenStorage';

export type ApiInit = {
  /** Chamado quando o access token precisa ser renovado (401 / expirado). */
  onUnauthorized?: () => Promise<void>;
};

let apiInit: ApiInit = {};

export function configureApi(init: ApiInit) {
  apiInit = init;
}

async function getBearer(): Promise<string | null> {
  if (await isAccessExpired()) {
    await apiInit.onUnauthorized?.();
  }
  return getAccessToken();
}

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null | (string | number)[]
>;

function appendQuery(path: string, query?: QueryParams): string {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  }
  const q = params.toString();
  if (!q) return path;
  const sep = path.includes('?') ? '&' : '?';
  return `${path}${sep}${q}`;
}

function resolvePrivateBase(): string {
  const { url: apiBaseUrl } = getEnvironment();
  const base = (apiBaseUrl ?? '').replace(/\/$/, '');
  if (!base) {
    throw new Error(
      'Configure URL da API: EXPO_PUBLIC_APP_ENV ou EXPO_PUBLIC_API_BASE_URL'
    );
  }
  return base;
}

function resolvePublicBase(): string {
  const { apiPublicUrl } = getEnvironment();
  const base = (apiPublicUrl ?? '').replace(/\/$/, '');
  if (!base) {
    throw new Error(
      'Configure API pública: EXPO_PUBLIC_API_PUBLIC_URL ou base privada para derivar /public'
    );
  }
  return base;
}

type RequestOptions = {
  query?: QueryParams;
  json?: unknown;
  body?: BodyInit | null;
  headers?: Record<string, string>;
};

async function privateFetch(
  method: string,
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { tenantId } = getAppExtra();
  const base = resolvePrivateBase();
  const url = path.startsWith('http')
    ? path
    : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const finalUrl = appendQuery(url, options.query);

  const token = await getBearer();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId;
  }

  let body: BodyInit | undefined;
  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.json);
  } else if (options.body !== undefined && options.body !== null) {
    body = options.body;
  }

  const res = await fetch(finalUrl, { method, headers, body });
  if (res.status === 401) {
    await apiInit.onUnauthorized?.();
  }
  return res;
}

async function publicFetch(
  method: string,
  path: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { tenantId } = getAppExtra();
  const base = resolvePublicBase();
  const url = path.startsWith('http')
    ? path
    : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const finalUrl = appendQuery(url, options.query);

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...options.headers,
  };
  if (tenantId) {
    headers['X-Tenant-Id'] = tenantId;
  }

  let body: BodyInit | undefined;
  if (options.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.json);
  } else if (options.body !== undefined && options.body !== null) {
    body = options.body;
  }

  return fetch(finalUrl, { method, headers, body });
}

async function parseJsonOrThrow(res: Response): Promise<unknown> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  const ct = res.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    return res.json() as Promise<unknown>;
  }
  const text = await res.text();
  return text;
}

/**
 * GET JSON na API privada (`/api/private` incluída em `apiBaseUrl`).
 */
export async function apiGet<T>(path: string, query?: QueryParams): Promise<T> {
  const res = await privateFetch('GET', path, { query });
  return parseJsonOrThrow(res) as Promise<T>;
}

export async function apiPost<T>(
  path: string,
  json?: unknown,
  query?: QueryParams
): Promise<T> {
  const res = await privateFetch('POST', path, { json, query });
  return parseJsonOrThrow(res) as Promise<T>;
}

export async function apiPut<T>(
  path: string,
  json?: unknown,
  query?: QueryParams
): Promise<T> {
  const res = await privateFetch('PUT', path, { json, query });
  return parseJsonOrThrow(res) as Promise<T>;
}

export async function apiDelete<T>(
  path: string,
  query?: QueryParams
): Promise<T> {
  const res = await privateFetch('DELETE', path, { query });
  return parseJsonOrThrow(res) as Promise<T>;
}

/**
 * POST com `FormData` (multipart). Não define `Content-Type` para o runtime definir o boundary.
 */
export async function apiPostFormData<T>(
  path: string,
  formData: FormData,
  query?: QueryParams
): Promise<T> {
  const res = await privateFetch('POST', path, { body: formData, query });
  return parseJsonOrThrow(res) as Promise<T>;
}

export async function apiPutFormData<T>(
  path: string,
  formData: FormData,
  query?: QueryParams
): Promise<T> {
  const res = await privateFetch('PUT', path, { body: formData, query });
  return parseJsonOrThrow(res) as Promise<T>;
}

/** GET na API pública (sem Bearer). */
export async function apiPublicGet<T>(
  path: string,
  query?: QueryParams
): Promise<T> {
  const res = await publicFetch('GET', path, { query });
  return parseJsonOrThrow(res) as Promise<T>;
}

/** POST JSON na API pública (sem Bearer). */
export async function apiPublicPost<T>(
  path: string,
  json?: unknown,
  query?: QueryParams
): Promise<T> {
  const res = await publicFetch('POST', path, { json, query });
  return parseJsonOrThrow(res) as Promise<T>;
}

/** POST multipart na API pública (sem Bearer). */
export async function apiPublicPostFormData<T>(
  path: string,
  formData: FormData,
  query?: QueryParams
): Promise<T> {
  const res = await publicFetch('POST', path, { body: formData, query });
  return parseJsonOrThrow(res) as Promise<T>;
}
