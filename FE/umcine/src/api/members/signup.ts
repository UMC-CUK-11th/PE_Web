import { ApiError, apiRequest } from "../api-client";

export interface SignupRequest { email: string; nickname: string; password: string }
export interface SignupResponse {
  isSuccess: true;
  code: string;
  message: string;
  result: { memberId: number; email: string; nickname: string };
}

export async function signup(body: SignupRequest) {
  const response = await apiRequest<SignupResponse>("members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (response?.isSuccess !== true || !response.result || typeof response.result.memberId !== "number" || typeof response.message !== "string") {
    throw new ApiError(201, "INVALID_RESPONSE", "서버 응답을 확인하지 못했어요. 잠시 후 다시 시도해 주세요.");
  }
  return response;
}
