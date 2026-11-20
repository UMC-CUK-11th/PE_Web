import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface MemberInfo { email: string; nickname: string; createdAt: string }
export async function getMe(signal?: AbortSignal) {
  const response = await authApi.get("members/me", { signal }).json<ApiResponse<MemberInfo>>();
  return response.result;
}
