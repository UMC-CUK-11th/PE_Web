import { apiClient } from "../api-client";
import { unwrapApiResult, type ApiResponse } from "../api-response";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  nickname: string;
  accessToken: string;
}

export async function login(body: LoginRequest) {
  const response = await apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResponse>>();
  return unwrapApiResult(response);
}
