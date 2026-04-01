/**
 * Portado de `frontend/app/src/app/shared/interfaces/ACCESS_CONFIG.ts`
 * (valores alinhados a TipoInstituicaoEnum / TipoPerfilEnum).
 */
import type { AccessRuleItem } from './appEnvironment.types';

export const ACCESS_CONFIG: Record<string, AccessRuleItem> = {
  OPERADOR_LOGISTICO: {
    tipoEntidade: 'OPERADOR_LOGISTICO',
    tipoPerfil: ['ADMIN', 'OPERACIONAL'],
  },
  EMBARCADOR: {
    tipoEntidade: 'EMBARCADOR',
    tipoPerfil: ['ADMIN'],
  },
  MASTER: {
    tipoEntidade: 'MASTER',
    tipoPerfil: ['ADMIN', 'OPERACIONAL', 'CS', 'GESTOR_OPERACIONAL'],
  },
  TRANSPORTADORA: {
    tipoEntidade: 'TRANSPORTADORA',
    tipoPerfil: ['ADMIN', 'OPERACIONAL'],
  },
};
