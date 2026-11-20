import { apiClient } from "../api-client";
import type { ApiResponse } from "../models";

export interface LoginRequest { email: string; password: string }
export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body })
    .json<ApiResponse<{ nickname: string; accessToken: string }>>();
}
