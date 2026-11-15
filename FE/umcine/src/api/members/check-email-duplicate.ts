import { apiRequest } from "../api-client";

export interface CheckEmailDuplicateResponse { available: boolean }

export function checkEmailDuplicate(email: string) {
  return apiRequest<CheckEmailDuplicateResponse>(`members/email/${encodeURIComponent(email)}`);
}
