import { env } from "../config/env";

export interface AvailabilityResponse { available: boolean }
export interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
export class MemberApiError extends Error {
  readonly status: number;
  constructor(status: number) {
    super(status === 404 ? "존재하지 않는 회원이에요." : `요청에 실패했어요. (HTTP ${status})`);
    this.status = status;
  }
}
export function memberApiUrl(path: string) {
  return `${env.backendApiBaseUrl.replace(/\/+$/, "")}${path}`;
}
export async function requestMemberApi<T>(path: string): Promise<T> {
  // TMDB 인증값은 우리 백엔드에 보내지 않는다.
  const response = await fetch(memberApiUrl(path));
  if (!response.ok) throw new MemberApiError(response.status);
  return response.json() as Promise<T>;
}

