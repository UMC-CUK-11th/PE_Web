import { authenticatedApiClient } from "../authenticated-api-client";
import type { ApiResponse } from "../models";
import type { Favorite } from "./models";

export async function getFavorites() {
  const response = await authenticatedApiClient.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}
