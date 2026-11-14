import { authApi } from "./auth-api";
import { requireApiSuccess, type ApiResponse } from "./models";

export interface FavoriteResponse {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface FavoriteStatus {
  isFavorite: boolean;
}

export async function getFavorites(signal?: AbortSignal) {
  const body = await authApi
    .get("favorites", { signal })
    .json<ApiResponse<FavoriteResponse[]>>();
  return requireApiSuccess(body, "즐겨찾기 목록을 불러오지 못했어요.").result;
}

export async function getFavoriteStatus(movieId: number, signal?: AbortSignal) {
  const body = await authApi
    .get(`favorites/${movieId}`, { signal })
    .json<ApiResponse<FavoriteStatus>>();
  return requireApiSuccess(body, "즐겨찾기 상태를 불러오지 못했어요.").result;
}

export async function setFavorite(movieId: number, isFavorite: boolean) {
  const request = isFavorite
    ? authApi.post("favorites", { json: { movieId } })
    : authApi.delete(`favorites/${movieId}`);
  const response = await request;
  if (response.status === 204) return;
  const body = (await response.json()) as ApiResponse<unknown>;
  requireApiSuccess(body, "즐겨찾기를 변경하지 못했어요.");
}
