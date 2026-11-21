import type { ApiResponse } from "../types/api";
import { apiClient } from "./api-client";
import { authApi } from "./auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingForm {
  score: number;
  comment: string;
}

// 회원의 평점 목록은 공개 API라 토큰 없이 요청함. 응답은 공통 형식 없이 배열 그대로 옴
export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

// 평점 쓰기/수정/삭제는 토큰의 회원으로 처리함 → authApi
export function createRating(movieId: number, form: RatingForm) {
  return authApi.post("ratings", { json: { movieId, ...form } }).json<ApiResponse<Rating>>();
}

export function updateRating(ratingId: number, form: RatingForm) {
  return authApi.patch(`ratings/${ratingId}`, { json: form }).json<ApiResponse<null>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
