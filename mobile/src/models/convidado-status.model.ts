/**
 * Status do convidado (campo status da entidade Convidado).
 * Valores utilizados na listagem e filtros.
 */
export type ConvidadoStatus =
    | 'PENDENTE'
    | 'ENVIADO'
    | 'CONFIRMADO'
    | 'RECUSADO'
    | 'AUTORIZADO'
    | 'CANCELADO'
    | 'EXCLUIDO'
    | 'EXPIRADO'
    | 'ERRO';

export const STATUS_CONFIG = {
    classes: {
        PENDENTE: 'status-pendente',
        ENVIADO: 'status-info',
        CONFIRMADO: 'status-autorizado',
        RECUSADO: 'status-recusado',
        AUTORIZADO: 'status-autorizado',
        CANCELADO: 'status-excluido',
        EXCLUIDO: 'status-excluido',
        EXPIRADO: 'status-expirado',
        ERRO: 'status-erro',
        /** Status visual derivado: CONFIRMADO + falha NUC (não existe no BD) */
        ERRO_INTEGRACAO: 'status-erro',
    } as Record<string, string>,
    icons: {
        PENDENTE: 'schedule',
        ENVIADO: 'send',
        CONFIRMADO: 'check_circle',
        RECUSADO: 'block',
        AUTORIZADO: 'check_circle',
        CANCELADO: 'cancel',
        EXCLUIDO: 'person_off',
        EXPIRADO: 'event_busy',
        ERRO: 'error',
        ERRO_INTEGRACAO: 'sync_problem',
    } as Record<string, string>,
    labels: {
        PENDENTE: 'Pendente',
        ENVIADO: 'Convite Enviado',
        CONFIRMADO: 'Confirmado',
        RECUSADO: 'Recusado',
        AUTORIZADO: 'Autorizado',
        CANCELADO: 'Cancelado',
        EXCLUIDO: 'Excluído',
        EXPIRADO: 'Expirado',
        ERRO: 'Erro',
        ERRO_INTEGRACAO: 'Erro de integração',
    } as Record<string, string>,
};

export const STATUS_ENVIO = {
    classes: {
        PENDENTE: 'status-pendente',
        ENVIADO: 'status-autorizado',
        ERRO: 'status-erro',
        DESABILITADO: 'status-default',
    } as Record<string, string>,
    icons: {
        PENDENTE: 'schedule',
        ENVIADO: 'check_circle',
        ERRO: 'error',
        DESABILITADO: 'block',
    } as Record<string, string>,
    labels: {
        PENDENTE: 'Pendente',
        ENVIADO: 'Enviado',
        ERRO: 'Erro',
        DESABILITADO: 'Desabilitado',
    } as Record<string, string>,
};
