// frontend/app/src/app/shared/models/api-response.model.ts

import { Invite } from "./invite.model";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface ConviteResponse {
  convite: Invite;
  status?: {
    valid: boolean;
    errors?: string[];
  };
}
