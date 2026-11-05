import { apiClient } from "../api-client";
import type { CheckResponse } from "./models";

export function checkEmail(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckResponse>();
}
