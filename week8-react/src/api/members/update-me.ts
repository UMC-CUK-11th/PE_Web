import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

export function updateMe(body: UpdateMeRequest): Promise<MemberInfo> {
  return authApi
    .patch("members/me", {
      json: body,
    })
    .json<MemberInfo>();
}
