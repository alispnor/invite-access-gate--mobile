// ==========================================
// INTERFACES PARA PAYLOAD
// ==========================================

/** Alinhado a `@shared/constants/processo-acesso-convite-steps` no Angular */
export type CategoriaConvite = 'CONVITE' | 'LIBERACAO_DIRETA';

export interface ConvidadoPessoa {
  nome: string;
  cpf: string;
  celular: string;
  email?: string;
  id?: number;
}

export interface ConvidadoVeiculo {
  placa: string;
}

export interface ConvidadoPayload {
  pessoa: ConvidadoPessoa;
  veiculo?: ConvidadoVeiculo;
}

export interface ConvidadoExistendPayload {
  /** Obrigatório para PESSOA e PESSOA-VEICULO; omitido para aba só veículo (VEICULO) */
  pessoa_id?: number;
  veiculo_id?: number;
}

export interface EnviarConvitePayload {
  ponto_atendimento_id: number;
  nome: string;
  data_liberacao: string;
  categoria: CategoriaConvite;
  convidados: ConvidadoPayload[];
  cnpj_operador_logistico?: string | null;
  cnpj_transportadora?: string | null;
}

export interface ConvidadoImportPayloadItem {
  nome: string;
  cpf: string;
  celular: string;
  placa?: string;
  email?: string;
}

/** Itens para import em lote só veículo (liberação direta), `POST /convite/import` com `tipo: 'VEICULO'`. */
export interface VeiculoImportPayloadItem {
  placa: string;
  cor?: string;
  marca?: string;
  modelo?: string;
  ano_modelo?: string;
}

export type EnviarConviteImportPayload =
  | {
      ponto_atendimento_id: number;
      data_liberacao: string;
      categoria: 'CONVITE';
      tipo: 'PESSOA' | 'PESSOA-VEICULO';
      convidados: ConvidadoImportPayloadItem[];
      cnpj_operador_logistico?: string | null;
      cnpj_transportadora?: string | null;
    }
  | {
      ponto_atendimento_id: number;
      data_liberacao: string;
      categoria: 'LIBERACAO_DIRETA';
      tipo: 'VEICULO';
      convidados: VeiculoImportPayloadItem[];
      cnpj_operador_logistico?: string | null;
      cnpj_transportadora?: string | null;
    };

export interface EnviarConviteIdsPayload {
  ponto_atendimento_id: number;
  nome: string;
  data_liberacao: string;
  categoria: CategoriaConvite;
  convidados: ConvidadoExistendPayload[];
  tipo: TabType;
  cnpj_operador_logistico?: string | null;
  cnpj_transportadora?: string | null;
}

export interface EnviarConviteManualPayload {
  ponto_atendimento_id: number;
  data_liberacao: string;
  categoria: CategoriaConvite;
  nome: string;
  cpf: string;
  celular: string;
  placa: string;
  email: string;
  tipo: TabType;
  cnpj_operador_logistico?: string | null;
  cnpj_transportadora?: string | null;
}

// ==========================================
// TIPOS DE ABA
// ==========================================

export type TabType = 'PESSOA' | 'PESSOA-VEICULO' | 'PONTOS-PERIODO';
export type TabMineType = 'CONVIDADOS' | 'PONTOS-PERIODO';

export interface TabMine {
  name: string;
  value: TabMineType;
}
export interface Tab {
  name: string;
  value: TabType;
}

// ==========================================
// INTERFACES PARA LISTAGEM
// ==========================================

export interface Person {
  id: number;
  pessoa_id?: number;
  nome: string;
  cpf?: string;
  cpf_mask?: string;
  celular?: string;
  email?: string;
  foto?: string;
  fotoUrl?: string;
  tipo_entidade_empresa?: string;
  razao_social_empresa?: string;
  Convidado?: any[];
}

export interface PersonWithVehicle extends Person {
  veiculos?: Vehicle[];
  veiculoSelecionadoId?: number | null;
  veiculoSelecionadoPlaca?: string;
}

export interface Vehicle {
  id: number;
  veiculo_id?: number;
  placa: string;
  marca?: string;
  modelo?: string;
  cor?: string;
  ano_modelo?: string;
}

// ==========================================
// INTERFACE PARA IMPORTAÇÃO EXCEL
// ==========================================

export interface ConvidadoImportado {
  nome: string;
  cpf: string;
  celular: string;
  email?: string;
  placa?: string;
  valido: boolean;
  erros: string[];
}

export interface VeiculoImportado {
  placa: string;
  cor: string;
  marca: string;
  modelo: string;
  ano_modelo: string;
  valido: boolean;
  erros: string[];
}

// ==========================================
// INTERFACE PARA CACHE
// ==========================================

export interface EnviarConviteCache {
  personInvites: any[];
  selectedPersonIds: number[];
  personVehicleInvites: any[];
  selectedPersonVehicleIds: number[];
}

// ==========================================
// INTERFACE PARA STATUS DE CONEXÃO
// ==========================================

export interface ConnectionStatusItem {
  connected: boolean;
  status: any;
}

export interface ConnectionStatus {
  whatsapp: ConnectionStatusItem;
  sms: ConnectionStatusItem;
  hasAnyConnection: boolean;
}

// ==========================================
// INTERFACE PARA TIPOS DE ENVIO DISPONÍVEIS
// ==========================================

export type TipoEnvio = 'whatsapp' | 'sms' | 'whatsapp/sms';

export interface TiposDisponiveis {
  tipos: TipoEnvio[];
  algum_habilitado: boolean;
}

// ==========================================
// INTERFACES PARA CONVITES-FEATURE (LISTAGEM)
// ==========================================

export interface ConvidadoFeaturePessoa {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated use cnpj_operador_logistico/cnpj_transportadora; API may still return this */
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
  created_at: string;
  updated_at: string;
}

export interface ConvidadoFeatureVeiculo {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated use cnpj_operador_logistico/cnpj_transportadora; API may still return this */
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

export interface ConvidadoFeature {
  id: number;
  pessoa_id: number;
  convite_id: number;
  veiculo_id?: number | null;
  usuario_criador_id: string;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated use cnpj_operador_logistico/cnpj_transportadora; API may still return this */
  documento_empresa?: string;
  razao_social_empresa: string;
  status: 'ENVIADO' | 'PENDENTE' | 'ERRO' | 'EXPIRADO';
  link_convite: string;
  easycontrol_response_id?: string;
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
  Pessoa?: ConvidadoFeaturePessoa;
  Veiculo?: ConvidadoFeatureVeiculo | null;
}

export interface ConviteFeature {
  id: number;
  ponto_atendimento_id: number;
  nome: string;
  descricao?: string;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated use cnpj_operador_logistico/cnpj_transportadora; API may still return this */
  documento_empresa?: string;
  razao_social_empresa: string;
  data_evento: string;
  data_inicio_validade: string;
  data_fim_validade: string;
  status: 'ATIVO' | 'EXPIRADO' | 'CANCELADO';
  tipo_envio: 'whatsapp' | 'sms';
  observacao?: string;
  created_by: string;
  updated_by?: string;
  deleted_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  Convidados?: ConvidadoFeature[];
}

export interface ConvitesFeatureListResponse {
  count: number;
  rows: ConviteFeature[];
}

export interface ConvidadosFeatureResponse {
  success: boolean;
  data: ConvidadoFeature[];
}

export interface ConvitesFeatureListParams {
  current?: number;
  limit?: number;
  status?: 'ATIVO' | 'EXPIRADO' | 'CANCELADO';
  nome?: string;
  dataInicio?: string;
  dataFim?: string;
}
