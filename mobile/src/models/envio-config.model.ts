/**
 * Interfaces para configuração de tipos de envio por empresa
 */

// ==========================================
// CONFIGURAÇÃO DE ENVIO
// ==========================================

export interface EnvioConfig {
  id?: number;
  cnpj_operador_logistico: string;
  razao_social_empresa: string;
  convite_whatsapp: boolean;
  convite_sms: boolean;
  algum_habilitado?: boolean;
  configurado?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TiposDisponiveis {
  cnpj_operador_logistico: string;
  tipos: TipoEnvio[];
  algum_habilitado: boolean;
}

export type TipoEnvio = 'convite_whatsapp' | 'convite_sms';

export interface EnvioConfigPayload {
  cnpj_operador_logistico: string;
  cnpj_transportadora?: string | null;
  convite_whatsapp: boolean;
  convite_sms: boolean;
}

/** Body do POST /api/private/configuracao (buscar) - alinhado ao req.body do backend */
export interface GetConfiguracaoBody {
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string;
}

/** Resposta do POST /api/private/configuracao (buscar por cnpj_operador_logistico no body, quando há dados) */
export interface ConfiguracaoResponse {
  id: number;
  cnpj_operador_logistico: string;
  cnpj_transportadora?: string | null;
  convite_sms: boolean;
  convite_whatsapp: boolean;
  convite_email?: boolean;
  created_by?: string;
  updated_by?: string | null;
  deleted_by?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

/** Body do POST /api/private/configuracao */
export interface ConfiguracaoPayload {
  cnpj_operador_logistico: string;
  cnpj_transportadora?: string | null;
  convite_sms: boolean;
  convite_whatsapp: boolean;
}

/** Resposta do POST /api/private/configuracao */
export interface ConfiguracaoSaveResponse {
  id: number;
  cnpj_operador_logistico: string;
  convite_sms: boolean;
  convite_whatsapp: boolean;
  convite_email?: boolean;
  created_by?: string;
  updated_by?: string | null;
  deleted_by?: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// CONFIGURAÇÃO POR PONTO DE ATENDIMENTO
// ==========================================

/** Tipo de envio para exibição (label e ícones) */
export type TipoEnvioDisplay = 'whatsapp' | 'sms' | 'whatsapp/sms';

export interface EnvioConfigPorPontoAtendimento {
  ponto_atendimento_id: number;
  cnpj_operador_logistico: string;
  documento_operador_logistico: string;
  razao_social_empresa: string;
  convite_whatsapp: boolean;
  convite_sms: boolean;
  /** Preenchido pelo select a partir de getConfiguracao + util */
  tipoEnvio?: TipoEnvioDisplay;
  tipoEnvioLabel?: string;
}

// ==========================================
// LISTAGEM DE CONFIGURAÇÕES (MASTER)
// ==========================================

export interface EnvioConfigListResponse {
  total: number;
  configs: EnvioConfig[];
}

// ==========================================
// RELATÓRIO DE USO
// ==========================================

export interface RelatorioParams {
  cnpj_operador_logistico?: string;
  data_inicio: string;  // formato YYYY-MM-DD
  data_fim: string;     // formato YYYY-MM-DD
}

export interface RelatorioDetalhamento {
  enviado: number;
  entregue: number;
  lido: number;
  pendente: number;
  erro_envio: number;
  erro_temporario: number;
}

export interface RelatorioCanal {
  total: number;
  sucesso: number;
  erro: number;
  taxa_sucesso: string;
  detalhamento: RelatorioDetalhamento;
}

export interface RelatorioResumo {
  total_envios: number;
  total_sucesso: number;
  total_erro: number;
  taxa_sucesso: string;
}

export interface RelatorioEnvio {
  cnpj_operador_logistico: string;
  razao_social_empresa: string;
  periodo: {
    data_inicio: string;
    data_fim: string;
  };
  configuracao: {
    convite_whatsapp: boolean;
    convite_sms: boolean;
  };
  resumo: RelatorioResumo;
  whatsapp: RelatorioCanal;
  sms: RelatorioCanal;
  gerado_em: string;
}

// ==========================================
// HISTÓRICO DE CONVITES
// ==========================================

export interface HistoricoConvitesParams {
  cnpj_operador_logistico?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface HistoricoConviteItem {
  id: number;
  cnpj_operador_logistico: string;
  razao_social_empresa: string;
  tipo_envio: TipoEnvio;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricoConvitesResponse {
  total: number;
  convites: HistoricoConviteItem[];
}

// ==========================================
// HISTÓRICO GERAL (MASTER)
// ==========================================

export interface HistoricoGeralResponse {
  total: number;
  por_empresa: {
    cnpj_operador_logistico: string;
    razao_social_empresa: string;
    total_convites: number;
    whatsapp: number;
    sms: number;
  }[];
  convites: HistoricoConviteItem[];
}

// ==========================================
// EMPRESA PARA SELECT
// ==========================================

export interface EmpresaOption {
  cnpj_operador_logistico: string;
  razao_social_empresa: string;
}
