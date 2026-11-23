import { apiClient } from "./api-client";
import { unwrapApiResponse, type ApiResponse } from "../types/api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SaveRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string;
}

export async function getMemberRatings(memberId: number) {
  return apiClient
    .get(`members/${memberId}/ratings`, { searchParams: { page: 0, size: 100 } })
    .json<Rating[]>();
}

export async function createRating(body: SaveRatingRequest) {
  const response = await apiClient.post("ratings", { json: body }).json<ApiResponse<Rating>>();
  return unwrapApiResponse(response);
}

export async function updateRating({ ratingId, score, comment }: UpdateRatingRequest) {
  const response = await apiClient
    .patch(`ratings/${ratingId}`, { json: { score, comment } })
    .json<ApiResponse<Rating>>();
  return unwrapApiResponse(response);
}

export async function deleteRating(ratingId: number) {
  await apiClient.delete(`ratings/${ratingId}`);
}
