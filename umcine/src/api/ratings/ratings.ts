import { apiClient } from "../api-client";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../members/models";
export interface RatingInfo {
  ratingId: number; movieId: number; score: number; comment: string | null;
  createdAt: string; updatedAt: string;
}
export interface RatingInput { score: number; comment: string; }
export async function getMemberRatings(memberId: number) {
  const response = await apiClient.get(`members/${memberId}/ratings`).json<ApiResponse<RatingInfo[]>>();
  return response.result;
}
export async function createRating(body: RatingInput & { movieId: number }) {
  return (await authApi.post("ratings", { json: body }).json<ApiResponse<RatingInfo>>()).result;
}
export async function updateRating(ratingId: number, body: RatingInput) {
  return (await authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<RatingInfo>>()).result;
}
export async function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
