/**
 * Tipo do convite / lote (campo `tipo` na API — ENUM VEICULO | PESSOA | PESSOA-VEICULO).
 */
export type ConviteTipoLote = 'VEICULO' | 'PESSOA' | 'PESSOA-VEICULO';

export interface ConviteTipoLoteConfig {
    class: string;
    icon: string;
    label: string;
}

export const TIPO_LOTE_CONFIG: Record<ConviteTipoLote, ConviteTipoLoteConfig> = {
    VEICULO: {
        class: 'tipo-lote-veiculo',
        icon: 'directions_car',
        label: 'Somente Veículo',
    },
    PESSOA: {
        class: 'tipo-lote-pessoa',
        icon: 'person',
        label: 'Somente Pessoa',
    },
    'PESSOA-VEICULO': {
        class: 'tipo-lote-pessoa-veiculo',
        icon: 'people_alt',
        label: 'Pessoa com Veículo',
    },
};
