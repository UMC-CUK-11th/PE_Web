import type { ApiResponse } from "../types/api";
import { authApi } from "./auth-api";

// 찜은 전부 "내" 데이터라 토큰이 필요함 → authApi
export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export function addFavorite(movieId: number) {
  return authApi.post("favorites", { json: { movieId } }).json<ApiResponse<unknown>>();
}

export function removeFavorite(movieId: number) {
  return authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
