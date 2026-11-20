import { apiClient } from "./api-client";
import { authApi } from "./auth-api";
import type { ApiResponse } from "./models";
import type { RatingResponse } from "./members";
import type { Favorite } from "./favorites";

export interface RatingInput { score: number; comment: string }
export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<RatingResponse[]>();
}
export function createRating(body: RatingInput & { movieId: number }) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<RatingResponse>>();
}
export function updateRating(ratingId: number, body: RatingInput) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<RatingResponse>>();
}
export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
export function createMovieRecord(body: RatingInput & { movieId: number; addToFavorites: boolean }) {
  return authApi.post("movie-records", { json: body })
    .json<ApiResponse<{ rating: RatingResponse; favorite: Favorite | null }>>();
}
