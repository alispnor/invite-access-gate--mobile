// ponto-atendimento.model.ts

export interface PontoAtendimento {
  id?: number;
  cnpj_operador_logistico: string;
  nome: string; // required
  descricao?: string;
  cep?: string | null;
  endereco?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  InstalacaoNuc?:Instalacao[];

  // Colunas preenchidas automaticamente pelo backend
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Instalacao {
  id?: number;
  cnpj_operador_logistico: string;
  ponto_atendimento_id?: number;
  licenca: string;
  descricao?: string;
  login_id?: string;
  password?: string;
  authorized_by_user?: any; // JSON
  company_id?: number;
  access_groups?: any; // JSON
  unit?: string;

  // Colunas preenchidas automaticamente pelo backend
  created_by?: string;
  updated_by?: string;
  deleted_by?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  // Relacionamento (para exibição)
  ponto_atendimento?: PontoAtendimento;
}

