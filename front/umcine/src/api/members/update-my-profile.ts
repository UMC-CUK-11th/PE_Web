import { apiClient } from "../api-client";
import { unwrapApiResult, type ApiResponse } from "../api-response";
import type { MyProfile } from "./get-my-profile";

export async function updateMyProfile(accessToken: string, nickname: string) {
  const response = await apiClient.patch("members/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
    json: { nickname },
  }).json<ApiResponse<MyProfile>>();
  return unwrapApiResult(response);
}
