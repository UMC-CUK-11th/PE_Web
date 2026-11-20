// 로그인과 내 정보 응답에는 memberId가 없어서 토큰 payload의 sub를 읽는다.
// 서명 검증은 서버가 하므로 여기서는 화면에 쓸 값만 꺼낸다
export function getMemberIdFromToken(accessToken: string | null): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const memberId = Number(JSON.parse(atob(payload)).sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
