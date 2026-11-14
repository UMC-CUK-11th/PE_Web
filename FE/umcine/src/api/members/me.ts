import { authApi } from "../auth-api";
import { requireApiSuccess, type ApiResponse } from "../models";
import type { MemberInfo } from "./models";

export async function getMe(signal?: AbortSignal): Promise<MemberInfo> {
  const response = await authApi
    .get("members/me", { signal })
    .json<ApiResponse<MemberInfo>>();
  return requireApiSuccess(response, "회원 정보를 불러오지 못했어요.").result;
}
