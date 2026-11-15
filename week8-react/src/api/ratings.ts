import { authApi } from "./auth-api";
import { apiClient } from "./api-client";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface UpdateRatingRequest {
  score: number;
  comment: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 특정 회원의 평점 목록 조회
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

// 평점 등록
export async function createRating(
  request: CreateRatingRequest,
): Promise<number> {
  const response = await authApi
    .post("ratings", {
      json: request,
    })
    .json<ApiResponse<number>>();

  return response.result;
}

// 평점 수정
export async function updateRating(
  ratingId: number,
  request: UpdateRatingRequest,
): Promise<void> {
  await authApi.patch(`ratings/${ratingId}`, {
    json: request,
  });
}

// 평점 삭제
export async function deleteRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`);
}
