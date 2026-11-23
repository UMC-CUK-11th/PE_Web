export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) return null;

  try {
    // 백엔드는 JWT의 sub에 회원 ID를 담습니다. 토큰 검증은 서버에서 수행합니다.
    const payload = accessToken.split(".")[1];
    const encoded = payload.replaceAll("-", "+").replaceAll("_", "/");
    const claims: { sub?: unknown } = JSON.parse(atob(encoded));
    const memberId = Number(claims.sub);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
