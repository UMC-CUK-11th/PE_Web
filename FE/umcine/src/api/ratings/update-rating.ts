import { authenticatedApiClient } from "../authenticated-api-client";
import type { ApiResponse } from "../models";
import type { Rating, RatingInput } from "./models";

export function updateRating(ratingId: number, body: RatingInput) {
  return authenticatedApiClient.patch(`ratings/${ratingId}`, { json: body }).json<ApiResponse<Rating>>();
}
