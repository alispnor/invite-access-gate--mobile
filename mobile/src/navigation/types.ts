export type InicioStackParamList = {
  InicioHome: undefined;
  // PA and NUC accessible from Home hub
  PaList: undefined;
  PaCreate: undefined;
  PaEdit: { id: string };
  NucList: undefined;
  NucCreate: undefined;
  NucEdit: { id: string };
  TermoPublicHome: { hash?: string } | undefined;
};

export type CadastroStackParamList = {
  CadastroMenu: undefined;
  PessoaList: undefined;
  PessoaCreate: undefined;
  PessoaEdit: { id: string };
  PessoaImport: undefined;
  VeiculoList: undefined;
  VeiculoCreate: undefined;
  VeiculoEdit: { id: string };
  VeiculoImport: undefined;
};

export type ConviteStackParamList = {
  ConviteEnviar: undefined;
  ConviteList: undefined;
  ConviteConvidados: { id: string };
};

export type RelatoriosStackParamList = {
  RelatorioGrid: undefined;
  ListaAutorizacao: undefined;
};

export type ConfigStackParamList = {
  ConfigHub: undefined;
  ConfigTipoEnvioConfig: undefined;
  TransportadoraList: undefined;
  TransportadoraEdit: { cnpj?: string } | undefined;
  TransportadoraTipoEnvioList: undefined;
  TransportadoraTipoEnvioEdit: undefined;
  WhatsappConfig: undefined;
};

export type TabParamList = {
  InicioTab: undefined;
  CadastroTab: undefined;
  ConviteTab: undefined;
  RelatoriosTab: undefined;
  ConfigTab: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};
