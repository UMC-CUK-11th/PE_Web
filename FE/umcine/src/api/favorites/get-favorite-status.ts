import { authenticatedApiClient } from "../authenticated-api-client";
import type { ApiResponse } from "../models";
import type { FavoriteStatus } from "./models";

export async function getFavoriteStatus(movieId: number) {
  const response = await authenticatedApiClient.get(`favorites/${movieId}`).json<ApiResponse<FavoriteStatus>>();
  return response.result;
}
