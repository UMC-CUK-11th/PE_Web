import { authApi } from "../auth-api";
import { unwrapApiResult, type ApiResponse } from "../api-response";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  isFavorite: boolean;
}

export const favoritesKey = (memberId: number | null) => ["favorites", memberId] as const;
export const favoriteStatusKey = (memberId: number | null, movieId: number) =>
  ["favorite-status", memberId, movieId] as const;

export async function getFavorites(signal?: AbortSignal) {
  const response = await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>();
  return unwrapApiResult(response);
}

export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  const response = await authApi.get(`favorites/${movieId}`, { signal }).json<ApiResponse<FavoriteStatus>>();
  return unwrapApiResult(response);
}

export async function addFavorite(movieId: number) {
  const response = await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
  return unwrapApiResult(response);
}

export async function removeFavorite(movieId: number) {
  const response = await authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
  if (!response.isSuccess) throw new Error(response.message);
}
