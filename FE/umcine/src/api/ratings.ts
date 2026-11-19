import { authRequest } from "./auth-api";
import type { ApiResponse } from "./members/me";
import type { RatingResponse } from "./member-client";
export type RatingAction = { kind: "create"; movieId: number; score: number; comment: string }
  | { kind: "update"; ratingId: number; score: number; comment: string }
  | { kind: "delete"; ratingId: number };
export function getOwnRatings(memberId: number, signal?: AbortSignal) {
  return authRequest<RatingResponse[]>(`members/${memberId}/ratings`, { signal });
}
export async function writeRating(action: RatingAction): Promise<ApiResponse<RatingResponse | null>> {
  if (action.kind === "delete") return authRequest<ApiResponse<null>>(`ratings/${action.ratingId}`, { method: "DELETE" });
  const body = { score: action.score, comment: action.comment, ...(action.kind === "create" ? { movieId: action.movieId } : {}) };
  return authRequest<ApiResponse<RatingResponse>>(action.kind === "create" ? "ratings" : `ratings/${action.ratingId}`, {
    method: action.kind === "create" ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}
