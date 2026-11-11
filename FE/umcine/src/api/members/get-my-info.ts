import { apiClient } from "../api-client";
import type { ApiResponse } from "../models";

export interface MemberInfo {
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export function getMyInfo(accessToken: string) {
  return apiClient.get("members/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    retry: 0,
  }).json<ApiResponse<MemberInfo>>();
}
