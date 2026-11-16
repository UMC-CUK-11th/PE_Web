import { HTTPError } from "ky";
import { authApi } from "./auth-api";

export interface Favorite {
  movieId: number;
  title?: string;
}

type ListResponse = Favorite[] | { result: Favorite[] | { favorites: Favorite[] } };
type DetailResponse = boolean | { isFavorite?: boolean; result?: boolean | { isFavorite?: boolean; movieId?: number } };

export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi.get("favorites").json<ListResponse>();
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.result)) return response.result;
  if (Array.isArray(response.result?.favorites)) return response.result.favorites;
  throw new Error("즐겨찾기 응답 형식이 예상과 달라요.");
}

export async function getFavorite(movieId: number): Promise<boolean> {
  try {
    const response = await authApi.get(`favorites/${movieId}`).json<DetailResponse>();
    if (typeof response === "boolean") return response;
    if (typeof response.isFavorite === "boolean") return response.isFavorite;
    if (typeof response.result === "boolean") return response.result;
    if (response.result && typeof response.result.isFavorite === "boolean") return response.result.isFavorite;
    return Boolean(response.result && "movieId" in response.result);
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) return false;
    throw error;
  }
}

export async function addFavorite(movieId: number): Promise<void> {
  await authApi.post("favorites", { json: { movieId } });
}

export async function removeFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`);
}
