import { apiClient } from "../api-client";
import { authApi } from "../auth-api";
import { unwrapApiResult, type ApiResponse } from "../api-response";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export const memberRatingsKey = (memberId: number | null) => ["members", memberId, "ratings"] as const;

export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(movieId: number, input: RatingInput) {
  const response = await authApi.post("ratings", { json: { movieId, ...input } }).json<ApiResponse<Rating>>();
  return unwrapApiResult(response);
}

export async function updateRating(ratingId: number, input: RatingInput) {
  const response = await authApi.patch(`ratings/${ratingId}`, { json: input }).json<ApiResponse<Rating>>();
  return unwrapApiResult(response);
}

export async function deleteRating(ratingId: number) {
  const response = await authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
  if (!response.isSuccess) throw new Error(response.message);
}
