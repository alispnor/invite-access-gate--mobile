/**
 * Barrel parcial: há tipos homónimos entre ficheiros (ex.: `ConviteStatus`, `TipoEnvio`,
 * `PontoAtendimento`, `STATUS_CONFIG`). Importe módulos específicos quando precisar de tudo:
 * `import type { Invite } from './invite.model'`, `from './gerenciar-convites.model'`, etc.
 */
export * from './keycloak-user';
export * from './whatsapp.model';
export * from './convidado-public.interface';
export * from './convite-status.model';
export type { ConvidadoStatus } from './convidado-status.model';
export {
  STATUS_CONFIG as CONVIDADO_STATUS_CONFIG,
  STATUS_ENVIO as CONVIDADO_STATUS_ENVIO,
} from './convidado-status.model';
export * from './convite-tipo-lote.model';
