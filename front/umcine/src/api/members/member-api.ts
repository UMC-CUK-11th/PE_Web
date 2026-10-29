const MEMBER_API_BASE_URL = "http://localhost:8080";

export interface AvailabilityResponse {
  available: boolean;
}

export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ApiResponse<T> =
  | { ok: true; status: number; body: T }
  | { ok: false; status: number; body: unknown };

async function getJson<T>(path: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${MEMBER_API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "omit",
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    return { ok: false, status: response.status, body };
  }

  return { ok: true, status: response.status, body: body as T };
}

export function getEmailAvailability(email: string) {
  return getJson<AvailabilityResponse>(`/members/email/${encodeURIComponent(email)}`);
}

export function getNicknameAvailability(nickname: string) {
  return getJson<AvailabilityResponse>(`/members/nickname/${encodeURIComponent(nickname)}`);
}

export function getMemberRatings(memberId: number) {
  if (!Number.isSafeInteger(memberId) || memberId <= 0) {
    throw new Error("memberId는 양의 정수여야 해요.");
  }

  return getJson<RatingResponse[]>(`/members/${memberId}/ratings`);
}
