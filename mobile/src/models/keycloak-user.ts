/**
 * Interface para tipagem do perfil de usuário do Keycloak
 * Substitui o uso de 'any' em múltiplos componentes
 */
export interface KeycloakUserProfile {
  id?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  createdTimestamp?: number;
  attributes?: {
    tipoEntidadeEmpresa?: string[];
    tipoPerfilUsuario?: string[];
    [key: string]: string[] | undefined;
  };
}

/**
 * Helper para obter o tipo de entidade do usuário
 */
export function getTipoEntidadeEmpresa(profile: KeycloakUserProfile | null | undefined): string | null {
  if (!profile?.attributes?.tipoEntidadeEmpresa) {
    return null;
  }
  return profile.attributes.tipoEntidadeEmpresa[0] || null;
}

/**
 * Helper para obter o tipo de perfil do usuário
 */
export function getTipoPerfilUsuario(profile: KeycloakUserProfile | null | undefined): string | null {
  if (!profile?.attributes?.tipoPerfilUsuario) {
    return null;
  }
  return profile.attributes.tipoPerfilUsuario[0] || null;
}
