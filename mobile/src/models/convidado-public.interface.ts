/**
 * Resposta do GET /api/public/convidado/hash/:hash
 */

/** Status possíveis do convite (fluxo público por hash). */
export type ConvidadoPublicStatus =
    | 'PENDENTE'
    | 'ENVIADO'
    | 'CONFIRMADO'
    | 'RECUSADO'
    | 'AUTORIZADO'
    | 'EXCLUIDO'
    | 'EXPIRADO'
    | 'ERRO';


export interface ConvidadoPublicPessoa {
  nome: string;
  cpf_mask: string;
}

export interface ConvidadoPublicVeiculo {
  placa_mask?: string;
}

export interface ConvidadoPublicPontoAtendimento {
  nome?: string;
  descricao?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

export interface ConvidadoPublicOperadorLogistico {
  razao_social?: string;
  cnpj_operador_logistico?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ConvidadoPublicTransportadora {
  razao_social?: string;
}

export interface ConvidadoPublicConvitePontoAtendimento {
  id?: number;
  convite_id?: number;
  ponto_atendimento_id?: number;
  PontoAtendimento?: ConvidadoPublicPontoAtendimento | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ConvidadoPublicConvite {
  razao_social_empresa?: string;
  data_liberacao?: string;
  data_expiracao?: string;
  PontoAtendimento?: ConvidadoPublicPontoAtendimento | null;
  OperadorLogistico?: ConvidadoPublicOperadorLogistico | null;
  Transportadora?: ConvidadoPublicTransportadora | null;
  ConvitePontoAtendimento?: ConvidadoPublicConvitePontoAtendimento[];
}

export interface ConvidadoPublic {
    status: ConvidadoPublicStatus | string;
    convite_hash?: string;
    Pessoa: ConvidadoPublicPessoa | null;
    Veiculo: ConvidadoPublicVeiculo | null;
    Convite?: ConvidadoPublicConvite | null;
}

export interface EnviarFotoResponse {
  success: boolean;
  message?: string;
}

/** Payload para aceitar termos (POST termo/:hash). */
export interface AceitarTermosPayload {
  geolocation?: string | null;
  geolocation_accuracy?: number | null;
  dispositivo?: string | null;
  navegador?: string | null;
  sistema_operacional?: string | null;
  data_sistema?: string | null;
  aceito: true;
}
