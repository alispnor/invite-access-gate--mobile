import type { KeycloakUserProfile } from '../models/keycloak-user';
import type { AccessRuleItem } from '../config/appEnvironment.types';

/**
 * Lógica portada de `AccessRulesService.checkPermission` (Angular).
 */
export function checkPermission(
  profile: KeycloakUserProfile | null | undefined,
  param: AccessRuleItem[] | null | undefined
): boolean {
  if (!param || param.length === 0) {
    return true;
  }
  try {
    if (!profile?.attributes) {
      return false;
    }

    const tipoEntidadeArray = profile.attributes.tipoEntidadeEmpresa;
    const tipoPerfilArray = profile.attributes.tipoPerfilUsuario;

    if (
      !tipoEntidadeArray ||
      !Array.isArray(tipoEntidadeArray) ||
      tipoEntidadeArray.length === 0
    ) {
      return false;
    }

    if (
      !tipoPerfilArray ||
      !Array.isArray(tipoPerfilArray) ||
      tipoPerfilArray.length === 0
    ) {
      return false;
    }

    const tipoEntidadeEmpresa = tipoEntidadeArray[0];
    const tipoPerfilUsuario = tipoPerfilArray[0];

    const checkAccess = param.find((item) => {
      if (!item?.tipoEntidade || !item.tipoPerfil) {
        return false;
      }
      const entidadeMatch = item.tipoEntidade === tipoEntidadeEmpresa;
      const perfilMatch =
        Array.isArray(item.tipoPerfil) &&
        item.tipoPerfil.includes(tipoPerfilUsuario);
      return entidadeMatch && perfilMatch;
    });

    return !!checkAccess;
  } catch {
    return false;
  }
}
