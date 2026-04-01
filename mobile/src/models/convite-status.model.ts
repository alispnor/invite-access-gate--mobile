/**
 * Status do convite (campo status da entidade Convite).
 * Valores utilizados na listagem e filtros.
 */
export type ConviteStatus = 'PENDENTE' | 'CRIADO' | 'PROCESSADO' | 'VENCIDO' | 'CANCELADO';

export interface iConfig {
    class: string;
    icon: string;
    label: string;
}

export const STATUS_CONFIG  = {
    CRIADO: { class: 'status-criado', icon: 'edit_note', label: 'Criado' },
    VENCIDO: { class: 'status-vencido', icon: 'event_busy', label: 'Vencido' },
    CANCELADO: { class: 'status-cancelado', icon: 'cancel', label: 'Cancelado' },
};
