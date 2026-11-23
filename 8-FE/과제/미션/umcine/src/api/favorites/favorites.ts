import type { ApiResponse } from "../api-response";
import { authApi } from "../auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
}

// 해제는 favoriteId가 아니라 화면이 알고 있는 movieId로 지정한다
export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
