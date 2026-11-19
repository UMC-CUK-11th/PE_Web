import { ApiError, apiRequest } from "../api-client";
export interface LoginRequest { email: string; password: string }
export interface LoginResponse { isSuccess: true; code: string; message: string; result: { nickname: string; accessToken: string } }
export async function login(body: LoginRequest) {
  const response = await apiRequest<LoginResponse>("auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!response?.result?.accessToken || typeof response.result.accessToken !== "string") throw new ApiError(200, "INVALID_RESPONSE", "로그인 응답을 확인하지 못했어요.");
  return response;
}
