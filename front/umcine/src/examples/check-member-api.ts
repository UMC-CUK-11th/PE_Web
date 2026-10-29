import {
  getEmailAvailability,
  getMemberRatings,
  getNicknameAvailability,
} from "../api/members/member-api";

async function logResponse(label: string, request: Promise<unknown>) {
  try {
    const response = await request;
    console.info(`[member-api] ${label}`, response);
  } catch (error) {
    console.error(`[member-api] ${label} 요청 실패`, error);
  }
}

export function checkMemberApi(searchParams: URLSearchParams) {
  const email = searchParams.get("email") ?? "umcine-check@example.invalid";
  const nickname = searchParams.get("nickname") ?? "umcine-check";
  const memberId = Number(searchParams.get("memberId"));
  const missingMemberId = Number(searchParams.get("missingMemberId"));

  void logResponse("email", getEmailAvailability(email));
  void logResponse("nickname", getNicknameAvailability(nickname));

  if (Number.isSafeInteger(memberId) && memberId > 0) {
    void logResponse("ratings", getMemberRatings(memberId));
  } else {
    console.info("[member-api] 실제 존재하는 memberId를 URL에 지정하면 평점 조회도 실행돼요.");
  }

  if (Number.isSafeInteger(missingMemberId) && missingMemberId > 0) {
    void logResponse("ratings-404", getMemberRatings(missingMemberId));
  }
}
