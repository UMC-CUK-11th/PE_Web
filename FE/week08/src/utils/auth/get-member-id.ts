// 서버 JWT의 sub에 담긴 회원 번호를 읽는다. 브라우저에서 서명을 검증하는 용도는 아니다.
export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(base64)) as { sub?: unknown };
    const memberId = Number(claims.sub);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
