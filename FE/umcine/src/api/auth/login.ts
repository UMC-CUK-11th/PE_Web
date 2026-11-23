import { apiClient } from "../api-client";
import { requireApiSuccess, type ApiResponse } from "../models";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  nickname: string;
  accessToken: string;
}

export async function login(credentials: LoginRequest) {
  const response = await apiClient
    .post("auth/login", { json: credentials })
    .json<ApiResponse<LoginResult>>();
  const success = requireApiSuccess(response, "로그인하지 못했어요.");
  if (!success.result?.accessToken)
    throw new Error("로그인 토큰을 받지 못했어요.");
  return success;
}
