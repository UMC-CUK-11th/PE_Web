import type { ApiResponse } from "../../types/api";
import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{ nickname: string; accessToken: string }>;

export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}
