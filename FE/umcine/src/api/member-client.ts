export type CheckResponse = { available: boolean };

export type RatingResponse = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

const baseUrl = (import.meta.env.VITE_BACKEND_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");

export class MemberApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function get<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`);
  } catch {
    throw new Error("서버에 연결하지 못했어요. 백엔드 실행 상태와 CORS 설정을 확인해 주세요.");
  }
  if (!response.ok) {
    const message = response.status === 404
      ? "존재하지 않는 회원이에요. 회원 번호를 확인해 주세요."
      : `요청을 처리하지 못했어요. (HTTP ${response.status})`;
    throw new MemberApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export const checkNickname = (nickname: string) =>
  get<CheckResponse>(`/members/nickname/${encodeURIComponent(nickname)}`);

export const checkEmail = (email: string) =>
  get<CheckResponse>(`/members/email/${encodeURIComponent(email)}`);

export const getMemberRatings = (memberId: string) =>
  get<RatingResponse[]>(`/members/${encodeURIComponent(memberId)}/ratings`);
