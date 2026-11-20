import { apiClient } from "./api-client";
import { unwrapApiResponse, type ApiResponse } from "../types/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  nickname: string;
  accessToken: string;
}

export async function login(body: LoginRequest) {
  const response = await apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResult>>();
  return unwrapApiResponse(response);
}
