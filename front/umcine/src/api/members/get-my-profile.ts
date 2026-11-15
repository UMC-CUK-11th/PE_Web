import { apiClient } from "../api-client";
import { unwrapApiResult, type ApiResponse } from "../api-response";

export interface MyProfile {
  email: string;
  nickname: string;
  createdAt: string;
}

export const myProfileQueryKey = ["members", "me"] as const;

export async function getMyProfile(accessToken: string, signal?: AbortSignal) {
  const response = await apiClient.get("members/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  }).json<ApiResponse<MyProfile>>();
  return unwrapApiResult(response);
}
