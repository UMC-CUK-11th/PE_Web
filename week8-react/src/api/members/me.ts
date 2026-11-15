import { authApi } from "../auth-api";

export interface MemberInfo {
  id: number;
  email: string;
  nickname: string;
}

export async function getMe(): Promise<MemberInfo> {
  return authApi.get("members/me").json<MemberInfo>();
}
