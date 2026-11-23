import { authRequest } from "./auth-api";
import type { ApiResponse } from "./members/me";
export interface Favorite { favoriteId: number; movieId: number; createdAt: string }
export interface FavoriteStatus { movieId: number; isFavorite: boolean }
export async function getFavorites(signal?: AbortSignal) {
  return (await authRequest<ApiResponse<Favorite[]>>("favorites", { signal })).result;
}
export async function getFavorite(movieId: number, signal?: AbortSignal) {
  return (await authRequest<ApiResponse<FavoriteStatus>>(`favorites/${movieId}`, { signal })).result;
}
export async function changeFavorite({ movieId, remove }: { movieId: number; remove: boolean }): Promise<ApiResponse<Favorite | null>> {
  return remove
    ? authRequest<ApiResponse<null>>(`favorites/${movieId}`, { method: "DELETE" })
    : authRequest<ApiResponse<Favorite>>("favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ movieId }) });
}
