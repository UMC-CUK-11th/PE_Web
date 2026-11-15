import { apiClient } from "../api-client";
import type { ApiResponse } from "../models";

export interface LoginRequest { email: string; password: string }
export interface LoginResult { nickname: string; accessToken: string }

export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body, retry: 0 }).json<ApiResponse<LoginResult>>();
}
