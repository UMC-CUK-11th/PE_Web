import { authApi } from "../auth-api";
import type { ApiResponse } from "../members/models";

export interface FavoriteInfo {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}
export interface FavoriteStatus { isFavorite: boolean; }

export async function getFavorites() {
  return (await authApi.get("favorites").json<ApiResponse<FavoriteInfo[]>>()).result;
}
export async function getFavoriteStatus(movieId: number) {
  return (await authApi.get(`favorites/${movieId}`).json<ApiResponse<FavoriteStatus>>()).result;
}
export async function createFavorite(movieId: number) {
  return (await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<FavoriteInfo>>()).result;
}
export async function deleteFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
