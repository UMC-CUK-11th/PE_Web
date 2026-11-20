import { apiClient } from "./api-client";
import { unwrapApiResponse, type ApiResponse } from "../types/api";

export interface Favorite {
  favoriteId?: number;
  movieId: number;
}

type FavoriteStatusPayload =
  | boolean
  | Favorite
  | { isFavorite: boolean }
  | { favorite: boolean }
  | null;

export async function getFavorites() {
  const response = await apiClient.get("favorites").json<ApiResponse<Favorite[]> | Favorite[]>();
  return unwrapApiResponse(response);
}

export async function getFavoriteStatus(movieId: number) {
  const response = await apiClient
    .get(`favorites/${movieId}`)
    .json<ApiResponse<FavoriteStatusPayload> | FavoriteStatusPayload>();
  const result = unwrapApiResponse(response);

  if (typeof result === "boolean") return result;
  if (!result) return false;
  if ("isFavorite" in result) return result.isFavorite;
  if ("favorite" in result) return result.favorite;
  return result.movieId === movieId;
}

export async function addFavorite(movieId: number) {
  const response = await apiClient
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite> | Favorite>();
  return unwrapApiResponse(response);
}

export async function deleteFavorite(movieId: number) {
  await apiClient.delete(`favorites/${movieId}`);
}
