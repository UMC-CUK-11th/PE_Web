import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";
import { umcClient } from "../umc-client";

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

// 공개 목록이라 토큰 없이 요청하고, 공통 형식으로 감싸지 않은 배열을 받는다
export function getMemberRatings(memberId: number) {
  return umcClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(body: RatingInput & { movieId: number }) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
}

export function updateRating({ ratingId, ...body }: RatingInput & { ratingId: number }) {
  return authApi.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
