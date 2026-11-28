import type { ApiResponse } from "../api-response";
import { umcClient } from "../umc-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{ nickname: string; accessToken: string }>;

// 로그인은 토큰이 없을 때 하는 요청이라 authApi가 아니라 umcClient로 보낸다
export function login(body: LoginRequest) {
  return umcClient.post("auth/login", { json: body }).json<LoginResponse>();
}
