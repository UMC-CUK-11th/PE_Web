import { authApi } from "./auth-api";
import { apiClient } from "./api-client";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingBody {
  score: number;
  comment: string;
}

interface RatingResponse {
  result: Rating;
}

export function getMemberRatings(memberId: number): Promise<Rating[]> {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export async function addRating(movieId: number, body: RatingBody): Promise<Rating> {
  const response = await authApi.post("ratings", { json: { movieId, ...body } }).json<RatingResponse>();
  return response.result;
}

export async function updateRating(ratingId: number, body: RatingBody): Promise<Rating> {
  const response = await authApi.patch(`ratings/${ratingId}`, { json: body }).json<RatingResponse>();
  return response.result;
}

export async function removeRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`);
}
