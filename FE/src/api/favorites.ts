import { authApi } from "./auth-api";
import type { ApiResponse } from "./models";

export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export async function getFavorites(signal?: AbortSignal) {
  return (await authApi.get("favorites", { signal }).json<ApiResponse<Favorite[]>>()).result;
}
export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  return (await authApi.get(`favorites/${movieId}`, { signal })
    .json<ApiResponse<{ isFavorite: boolean }>>()).result;
}
export function createFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}
export function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
