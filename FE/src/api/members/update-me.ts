import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { MemberInfo } from "./me";

export function updateMe(body: { nickname: string }) {
  return authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>();
}
