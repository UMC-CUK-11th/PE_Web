import { apiClient } from "../api-client";

export function checkNicknameDuplicate(nickname: string) {
  return apiClient.get(`members/nickname/${encodeURIComponent(nickname)}`).json<{ available: boolean }>();
}
