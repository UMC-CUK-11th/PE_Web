import { apiRequest } from "../api-client";

export interface CheckNicknameDuplicateResponse { available: boolean }

export function checkNicknameDuplicate(nickname: string) {
  return apiRequest<CheckNicknameDuplicateResponse>(`members/nickname/${encodeURIComponent(nickname)}`);
}
