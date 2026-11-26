import { authRequest } from "../auth-api";
import { ApiError } from "../api-client";
import { useAuthStore } from "../../stores/auth-store";
export interface MemberInfo { memberId: number; email: string; nickname: string; createdAt: string }
export interface ApiResponse<T> { isSuccess: true; code: string; message: string; result: T }
type MemberPayload = Omit<MemberInfo, "memberId"> & { memberId?: number };

function withMemberId(profile: MemberPayload): MemberInfo {
  if (typeof profile.memberId === "number" && Number.isSafeInteger(profile.memberId) && profile.memberId > 0) {
    return { ...profile, memberId: profile.memberId };
  }
  // 기존 서버의 /me 응답에는 ID가 없습니다. 서버 인증이 성공한 뒤
  // 토큰의 sub를 공개 평점 조회 경로에만 사용합니다. 쓰기 권한은 서버가 검증합니다.
  const claims = useAuthStore.getState().accessToken?.split(".")[1];
  if (claims) {
    try {
      const { sub } = JSON.parse(atob(claims.replace(/-/g, "+").replace(/_/g, "/"))) as { sub?: unknown };
      const id = typeof sub === "string" && /^[1-9]\d*$/.test(sub) ? Number(sub) : NaN;
      if (Number.isSafeInteger(id)) return { ...profile, memberId: id };
    } catch { /* 아래에서 잘못된 응답으로 처리합니다. */ }
  }
  throw new ApiError(200, "INVALID_PROFILE", "회원 번호를 확인하지 못했어요. 다시 로그인해 주세요.");
}

export async function getMe(signal?: AbortSignal) {
  return withMemberId((await authRequest<ApiResponse<MemberPayload>>("members/me", { signal })).result);
}
export async function updateMe(body: { nickname: string }) {
  const response = await authRequest<ApiResponse<MemberPayload>>("members/me", {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return { ...response, result: withMemberId(response.result) };
}
