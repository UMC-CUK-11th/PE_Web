import { apiClient } from "../api-client";
import type { CheckResponse } from "./models";

export function checkNickname(nickname: string) {
  return apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckResponse>();
}
