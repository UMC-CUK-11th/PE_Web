import { authRequest } from "../auth-api";
export interface MemberInfo { memberId: number; email: string; nickname: string; createdAt: string }
export interface ApiResponse<T> { isSuccess: true; code: string; message: string; result: T }
export async function getMe(signal?: AbortSignal) {
  return (await authRequest<ApiResponse<MemberInfo>>("members/me", { signal })).result;
}
export function updateMe(body: { nickname: string }) {
  return authRequest<ApiResponse<MemberInfo>>("members/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}
