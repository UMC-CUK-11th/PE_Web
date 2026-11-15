import { apiClient } from "../api-client";

export function checkEmailDuplicate(email: string) {
  return apiClient.get(`members/email/${encodeURIComponent(email)}`).json<{ available: boolean }>();
}
