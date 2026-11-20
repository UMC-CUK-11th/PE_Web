import { apiClient } from '../api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

export function login(body: LoginRequest) {
  return apiClient.post('auth/login', { json: body }).json<LoginResponse>();
}

/* POST /auth/login에 이메일과 비밀번호를 보내면 닉네임과 토큰을 받음 */
