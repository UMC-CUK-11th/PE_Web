import type { ApiResponse } from "../../types/api";
import { authApi } from "../auth-api";

export interface MemberInfo {
  memberId: number; // 평점 목록 조회(GET /members/{memberId}/ratings)에 필요해서 BE 응답에 추가
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<ApiResponse<MemberInfo>>();
  return response.result;
}
