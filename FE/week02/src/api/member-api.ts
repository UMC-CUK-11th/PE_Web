import { apiClient } from "./api-client";
import { unwrapApiResponse, type ApiResponse } from "../types/api";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMyInfo() {
  const response = await apiClient.get("members/me").json<ApiResponse<MemberInfo>>();
  return unwrapApiResponse(response);
}

export async function updateMyInfo(nickname: string) {
  const response = await apiClient
    .patch("members/me", { json: { nickname } })
    .json<ApiResponse<MemberInfo>>();
  return unwrapApiResponse(response);
}
