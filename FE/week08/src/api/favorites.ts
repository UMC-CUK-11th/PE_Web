import { authApi } from "./auth-api";

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

interface ApiResponse<T> {
  result: T;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ApiResponse<Favorite[]>>();
  return response.result;
}

export async function getFavorite(movieId: number): Promise<boolean> {
  const response = await authApi.get(`favorites/${movieId}`).json<ApiResponse<{ isFavorite: boolean }>>();
  return response.result.isFavorite;
}

export async function addFavorite(movieId: number): Promise<Favorite> {
  const response = await authApi.post("favorites", { json: { movieId } }).json<ApiResponse<Favorite>>();
  return response.result;
}

export async function removeFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`);
}
