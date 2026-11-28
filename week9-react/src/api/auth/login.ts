import ky from "ky";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return ky
    .post(`${API_BASE_URL}/auth/login`, {
      json: request,
    })
    .json<LoginResponse>();
}

