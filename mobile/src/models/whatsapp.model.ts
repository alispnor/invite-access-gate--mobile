/**
 * Interfaces para integração com WhatsApp Evolution API
 */

export interface WhatsAppInstancia {
  documento_empresa: string;
  razao_social_empresa: string;
  instance_name: string;
  status: WhatsAppStatusType;
}

export type WhatsAppStatusType = 'CONECTADO' | 'DESCONECTADO' | 'CRIADO';
export type WhatsAppStateType = 'open' | 'connecting' | 'close';

/** Resposta do GET /api/private/configuracao/whatsapp */
export interface WhatsAppConfiguracaoResponse {
  instance: {
    instanceName: string;
    state: string;
  };
}

export interface WhatsAppStatus {
  instancia: WhatsAppInstancia;
  evolutionResponse: {
    instance: {
      instanceName: string;
      state: WhatsAppStateType;
    };
  };
}

export interface WhatsAppQRCode {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

export interface WhatsAppCreateInstanceResponse {
  instancia: {
    updated_by: string | null;
    deleted_by: string | null;
    id: number;
    documento_empresa: string;
    razao_social_empresa: string;
    instance_name: string;
    instance_id: string;
    api_key: string;
    status: WhatsAppStatusType;
    created_by: string;
    updated_at: string;
    created_at: string;
  };
  evolutionResponse: {
    instance: {
      instanceName: string;
      instanceId: string;
      webhook_wa_business: string | null;
      access_token_wa_business: string;
      status: string;
    };
    hash: {
      apikey: string;
    };
    qrcode: WhatsAppQRCode;
  };
}

export interface SendMessageRequest {
  number: string;
  text: string;
}

export interface SendMessageResponse {
  success: boolean;
  result: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message: {
      extendedTextMessage: {
        text: string;
      };
    };
    messageTimestamp: string;
    status: string;
  };
}
