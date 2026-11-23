import { authApi } from "./auth-api";
import type { RatingResponse } from "./members";
import { requireApiSuccess, type ApiResponse } from "./models";

export interface RatingInput {
  score: number;
  comment: string | null;
}

export async function createRating(input: RatingInput & { movieId: number }) {
  const body = await authApi
    .post("ratings", { json: input })
    .json<ApiResponse<RatingResponse>>();
  return requireApiSuccess(body, "평점을 등록하지 못했어요.").result;
}

export async function updateRating(ratingId: number, input: RatingInput) {
  const body = await authApi
    .patch(`ratings/${ratingId}`, { json: input })
    .json<ApiResponse<RatingResponse>>();
  return requireApiSuccess(body, "평점을 수정하지 못했어요.").result;
}

export async function deleteRating(ratingId: number) {
  const body = await authApi
    .delete(`ratings/${ratingId}`)
    .json<ApiResponse<null>>();
  requireApiSuccess(body, "평점을 삭제하지 못했어요.");
}
