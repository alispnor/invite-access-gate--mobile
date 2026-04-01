export interface CreateInviteDto {
  tipo: ConviteTipo;
  data_liberacao?: Date | string;
  guests: CreateGuestDto[];
}

export interface CreateGuestDto {
  pessoa_id?: number | null;
  veiculo_id?: number | null;
  nome: string;
  documento: string;
  placa: string;
  expira_em?: Date | string;
  dias_expiracao?: number;
  status?: GuestStatus;
}

export interface UpdateInviteDto {
  tipo?: ConviteTipo;
  data_liberacao?: Date | string;
}

export interface UpdateGuestDto {
  pessoa_id?: number | null;
  veiculo_id?: number | null;
  nome?: string;
  documento?: string;
  placa?: string;
  status?: GuestStatus;
  expira_em?: Date | string;
  flag_aceito?: boolean;
}

export interface GuestFilters {
  invite_id?: number;
  pessoa_id?: number;
  veiculo_id?: number;
  flag_aceito?: boolean;
  is_expired?: boolean;
  is_valid?: boolean;
  status?: string;
  nome?: string;
  documento?: string;
  placa?: string;
  include_deleted?: boolean;
}

export interface PaginatedInviteResponse {
  count: number;
  rows: Invite[];
}

export interface InviteFilters {
  tipo?: ConviteTipo;
  autorizado?: boolean;
  data_inicio?: string;
  data_fim?: string;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string;
  ponto_atendimento_id?: number; // Filtro por ponto de atendimento
}

export interface InvitePagination {
  current: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export type ConviteTipo = 'VEICULO' | 'PESSOA' | 'PESSOA-VEICULO';
export type ConviteStatus = 'PENDENTE' | 'PROCESSANDO' | 'PROCESSADO' | 'EXPIRADO' | 'ERRO';
export type GuestStatus = 'ACEITO' | 'AUTORIZADO' | 'PENDENTE' | 'EXCLUIDO' | 'ERRO';
export type GuestStatusNuc = 'PROCESSADO' | 'PENDENTE' | 'ERRO' | 'EXCLUIDO' | 'EXPIRADO';

// Interface Pessoa
export interface Pessoa {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this; use cnpj_operador_logistico/cnpj_transportadora */
  documento_empresa?: string;
  nome: string;
  cpf: string;
  cpf_mask: string | null;
  celular: string | null;
  email: string | null;
  cnh: string | null;
  foto: string | null;
  foto_created_at: string | null;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Interface Veículo
export interface Veiculo {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this; use cnpj_operador_logistico/cnpj_transportadora */
  documento_empresa?: string;
  pessoa_id: number | null;
  placa: string;
  cor: string;
  marca: string;
  modelo: string;
  ano_modelo: string;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InstalacaoNuc {
  descricao: string;
}

export interface AcessoInstalacaoNuc {
  id: number;
  convidado_id: number;
  instalacao_nuc_id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this */
  documento_empresa?: string;
  statusNuc: GuestStatusNuc;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  InstalacaoNuc: InstalacaoNuc;
}

// Interface Guest (Convidado)
export interface Guest {
  id: number;
  convite_id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this */
  documento_empresa?: string;
  pessoa_id: number | null;
  veiculo_id: number | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  Pessoa: Pessoa | null;
  Veiculo: Veiculo | null;
  status: GuestStatus;
  AcessoInstalacaoNuc: AcessoInstalacaoNuc[];
}

// Interface Invite (Convite)
export interface Invite {
  id: number;
  cnpj_operador_logistico?: string;
  cnpj_transportadora?: string | null;
  /** @deprecated API may still return this */
  documento_empresa?: string;
  ponto_atendimento_id: number;
  ponto_atendimento_nome?: string; // Nome do ponto de atendimento
  tipo: ConviteTipo;
  data_liberacao: string;
  data_expiracao: string;
  status: ConviteStatus;
  created_by: string;
  updated_by: string | null;
  deleted_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  pessoa_id: number | null;
  total_convidados: number;
  PontoAtendimento?: any;
  tipo_entidade_empresa?: string;
  razao_social_empresa?: string;
}

// Response paginado
export interface PaginatedResponse<T> {
  count: number;
  rows: T[];
}


// Interfaces para Report
export interface ReportData {
  totalInvites: number;
  invitesPorTipo: TipoCount[];
  invitesPorStatus: StatusCount[];
  totalGuests: number;
  guestsAtivos: number;
  guestsExpirados: number;
  taxaAceitacao: number;
  guestsPorStatus: StatusCount[];
  guestsPorStatusNuc: StatusCount[];
  invitesPorPeriodo: PeriodoCount[];
  guestsPorPeriodo: PeriodoCount[];
  invitesRecentes: Invite[];
  guestsRecentes: Guest[];
  // Métricas adicionais
  guestsAceitos?: number;
  guestsPendentes?: number;
  guestsComErro?: number;
  guestsExcluidos?: number;
  totalInstalacoes?: number;
  instalacoesProcessadas?: number;
  instalacoesPendentes?: number;
  instalacoesComErro?: number;
  instalacoesExpiradas?: number;
  instalacoesExcluidas?: number;
  taxaSucessoNuc?: number;
}

export interface TipoCount {
  tipo: string;
  count: number;
  percentage: number;
}

export interface StatusCount {
  status: string;
  count: number;
  percentage: number;
}

export interface PeriodoCount {
  periodo: string;
  count: number;
  aceitos: number;
  recusados: number;
}



