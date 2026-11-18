import { authenticatedApiClient } from "../authenticated-api-client";
import type { ApiResponse } from "../models";
import type { Favorite } from "./models";

export function createFavorite(movieId: number) {
  return authenticatedApiClient.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}
