import type { KeycloakUserProfile } from '../models/keycloak-user';
import { decodeJwtPayload } from './jwtPayload';

function toStringArray(v: unknown): string[] | undefined {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') return [v];
  return undefined;
}

/**
 * Mapeia a resposta do endpoint UserInfo do Keycloak para `KeycloakUserProfile`.
 * Atributos custom podem vir como string ou array conforme mappers do realm.
 */
export function mapUserInfoToProfile(
  json: Record<string, unknown>
): KeycloakUserProfile {
  const attributes: KeycloakUserProfile['attributes'] = {};

  const te =
    json.tipoEntidadeEmpresa ??
    json.tipo_entidade_empresa ??
    json['tipoEntidadeEmpresa'];
  const tp =
    json.tipoPerfilUsuario ??
    json.tipo_perfil_usuario ??
    json['tipoPerfilUsuario'];

  const teArr = toStringArray(te);
  const tpArr = toStringArray(tp);
  if (teArr) attributes.tipoEntidadeEmpresa = teArr;
  if (tpArr) attributes.tipoPerfilUsuario = tpArr;

  return {
    id: typeof json.sub === 'string' ? json.sub : undefined,
    username:
      typeof json.preferred_username === 'string'
        ? json.preferred_username
        : undefined,
    email: typeof json.email === 'string' ? json.email : undefined,
    emailVerified:
      typeof json.email_verified === 'boolean' ? json.email_verified : undefined,
    firstName:
      typeof json.given_name === 'string' ? json.given_name : undefined,
    lastName: typeof json.family_name === 'string' ? json.family_name : undefined,
    attributes: Object.keys(attributes).length ? attributes : undefined,
  };
}

/**
 * GET `/protocol/openid-connect/userinfo` no realm (Bearer access_token).
 */
export async function fetchKeycloakUserProfile(
  accessToken: string,
  userinfoEndpoint: string
): Promise<KeycloakUserProfile> {
  const res = await fetch(userinfoEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UserInfo ${res.status}: ${text.slice(0, 120)}`);
  }

  const json = (await res.json()) as Record<string, unknown>;
  let profile = mapUserInfoToProfile(json);

  if (
    !profile.attributes?.tipoEntidadeEmpresa?.length ||
    !profile.attributes?.tipoPerfilUsuario?.length
  ) {
    const claims = decodeJwtPayload(accessToken);
    if (claims) {
      const fromJwt = mapUserInfoToProfile(claims);
      profile = {
        ...profile,
        attributes: {
          ...fromJwt.attributes,
          ...profile.attributes,
          tipoEntidadeEmpresa:
            profile.attributes?.tipoEntidadeEmpresa ??
            fromJwt.attributes?.tipoEntidadeEmpresa,
          tipoPerfilUsuario:
            profile.attributes?.tipoPerfilUsuario ??
            fromJwt.attributes?.tipoPerfilUsuario,
        },
      };
    }
  }

  return profile;
}
