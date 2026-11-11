import { authenticatedApiClient } from "../authenticated-api-client";
import type { ApiResponse } from "../models";
import type { Rating, RatingInput } from "./models";

export function createRating(body: RatingInput & { movieId: number }) {
  return authenticatedApiClient.post("ratings", { json: body }).json<ApiResponse<Rating>>();
}
