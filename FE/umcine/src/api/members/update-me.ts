import { authApi } from "../auth-api";
import { requireApiSuccess, type ApiResponse } from "../models";
import type { MemberInfo } from "./models";

export async function updateMe(nickname: string) {
  const response = await authApi
    .patch("members/me", { json: { nickname } })
    .json<ApiResponse<MemberInfo>>();
  return requireApiSuccess(response, "닉네임을 저장하지 못했어요.");
}
