// frontend/app/src/app/modules/convite/models/gerenciar-convites.model.ts

import type { ConvidadoStatus } from './convidado-status.model';
import type { ConviteStatus } from './convite-status.model';
import type { ConviteTipoLote } from './convite-tipo-lote.model';

// ==========================================
// INTERFACES PARA CONVITES-FEATURE
// ==========================================

/**
 * Pessoa vinculada ao convidado
 */
export interface ConvidadoPessoa {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this */
  documento_empresa?: string;
  razao_social_empresa: string;
  tipo_entidade_empresa: string;
  nome: string;
  cpf_mask: string;
  cpf: string;
  celular: string;
  email?: string;
  cnh?: string;
  foto?: string;
  foto_created_at?: string | null;
  /** Preenchido na UI após getFotoUrl */
  fotoUrl?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Veículo vinculado ao convidado
 */
export interface ConvidadoVeiculo {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this */
  documento_empresa?: string;
  razao_social_empresa: string;
  tipo_entidade_empresa: string;
  placa: string;
  cor?: string;
  marca?: string;
  modelo?: string;
  ano_modelo?: string;
  created_at: string;
  updated_at: string;
}

export type { ConvidadoStatus } from './convidado-status.model';
export type { ConviteStatus } from './convite-status.model';
export type ConvidadoStatusEnvio = 'PENDENTE' | 'ENVIADO' | 'ERRO' | 'DESABILITADO';

/**
 * Tipo de envio
 */
export type TipoEnvio = 'whatsapp' | 'sms';

/** Resumo de integração assíncrona (NUC) retornado na listagem de convidados */
export interface ConvidadoIntegracaoResumo {
    totalEsperado?: number;
    autorizadas?: number;
    falhas?: number;
    pendente?: number;
}

/** Payload em `ConvidadoPontoAtendimentoInstalacaoNuc[].response` (sucesso ou erro). */
export interface ConvidadoNucIntegracaoResponse {
    error?: boolean;
    message?: string;
    sucesso?: boolean;
    mensagem?: string;
    instalacao_descricao?: string;
}

export interface ConvidadoInstalacaoNucRef {
    id: number;
    descricao: string;
}

export interface ConvidadoPontoAtendimentoInstalacaoNucItem {
    instalacao_nuc_id?: number;
    status?: string;
    authorization_id?: number | null;
    response?: ConvidadoNucIntegracaoResponse;
    InstalacaoNuc?: ConvidadoInstalacaoNucRef;
}

/**
 * Convidado individual de um convite
 */
export interface Convidado {
    id: number;
    pessoa_id: number;
    convite_id: number;
    veiculo_id?: number | null;
    usuario_criador_id: string;
    cnpj_operador_logistico?: string;
    cnpj_transportadora?: string | null;
    /** @deprecated API may still return this */
    documento_empresa?: string;
    razao_social_empresa: string;
    // Propriedades diretas (vindas do backend após mudança de nomenclatura)
    nome: string;
    cpf?: string;
    placa?: string;
    celular?: string;
    status: ConvidadoStatus;
    status_sms: ConvidadoStatusEnvio;
    status_whatsapp: ConvidadoStatusEnvio;
    convite_hash: string;
    data_visita: string;
    data_inicio_validade: string;
    data_fim_validade: string;
    observacao?: string;
    created_by: string;
    updated_by?: string;
    deleted_by?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    // Relacionamentos (podem vir do backend em alguns casos)
    Pessoa?: ConvidadoPessoa;
    Veiculo?: ConvidadoVeiculo | null;
    ConvidadoPontoAtendimentoInstalacaoNuc?: ConvidadoPontoAtendimentoInstalacaoNucItem[];
    integracao_resumo?: ConvidadoIntegracaoResumo;
    /** Preenchido na UI: rótulo "N.º" na listagem paginada (ex.: "1 / 50") */
    ordemLista?: string;
}

/**
 * Operador logístico (incluído na resposta da listagem de convites)
 */
export interface OperadorLogistico {
    razao_social: string;
}

/**
 * Transportadora (incluída na resposta da listagem de convites)
 */
export interface Transportadora {
    razao_social: string;
}

export interface ConvitePontoAtendimento {
    id?: number;
    PontoAtendimento: PontoAtendimento;
}

/**
 * Ponto de atendimento (incluído na resposta da listagem de convites)
 */
export interface PontoAtendimento {
    id?: number;
    nome: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}

/**
 * Convite (lote de convidados enviados)
 */
export interface Convite {
    id: number;
    nome?: string;
    descricao?: string;
    cnpj_operador_logistico?: string;
    cnpj_transportadora?: string | null;
    /** @deprecated API may still return this */
    documento_empresa?: string;
    /** @deprecated Preferir OperadorLogistico?.razao_social e Transportadora?.razao_social */
    razao_social_empresa?: string;
    tipo_entidade_empresa?: string;
    data_liberacao?: string;
    data_expiracao?: string;
    data_evento?: string;
    data_inicio_validade?: string;
    data_fim_validade?: string;
    status: ConviteStatus;
    /** CONVITE | LIBERACAO_DIRETA - vindo do backend */
    categoria?: 'CONVITE' | 'LIBERACAO_DIRETA';
    /** VEICULO | PESSOA | PESSOA-VEICULO - vindo do backend */
    tipo?: ConviteTipoLote | string;
    tipo_envio?: TipoEnvio;
    observacao?: string;
    created_by: string;
    updated_by?: string;
    deleted_by?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    Convidados?: Convidado[];
    total_convidados?: number;
    totalConvidados?: number;
    pontoAtendimentoNome?: string;
    OperadorLogistico?: OperadorLogistico | null;
    Transportadora?: Transportadora | null;
    ConvitePontoAtendimento?: ConvitePontoAtendimento[] | null;
    /** Preenchido na UI: rótulo "N.º" na listagem paginada (ex.: "1 / 50") */
    ordemLista?: string;
}

/**
 * Resposta da listagem de convites
 */
export interface ConvitesListResponse {
  count: number;
  rows: Convite[];
}

/**
 * Resposta da listagem de convidados
 */
export interface ConvidadosResponse {
  success: boolean;
  count: number;
  rows: Convidado[];
}

/**
 * Resposta da listagem de convidados por convite (GET /convidado/:conviteId)
 */
export interface ConvidadosPorConviteResponse {
  count: number;
  rows: Convidado[];
}

/**
 * Parâmetros para listagem de convites
 */
export interface ConvitesListParams {
  current?: number;
  limit?: number;
  status?: ConviteStatus;
  categoria?: 'CONVITE' | 'LIBERACAO_DIRETA';
  tipo?: ConviteTipoLote;
  nome?: string;
  dataInicio?: string;
  dataFim?: string;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string;
}

/**
 * Parâmetros para listagem de convidados
 */
export interface ConvidadosListParams {
  current?: number;
  limit?: number;
  status?: ConvidadoStatus;
  nome?: string;
  cpf?: string;
  placa?: string;
  /** Quando true, envia query opcional ao backend (ex.: integracao_com_falha); o backend pode ignorar até suportar. */
  integracaoComFalha?: boolean;
}

/**
 * Filtros para listagem de convidados (deprecated - usar ConvidadosListParams)
 */
export interface ConvidadosFilters {
  status?: ConvidadoStatus;
  nome?: string;
  cpf?: string;
  placa?: string;
}
