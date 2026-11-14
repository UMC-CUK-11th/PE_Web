import type { ApiResponse } from "../../types/api";
import { authApi } from "../auth-api";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<ApiResponse<MemberInfo>>();
  return response.result;
}
