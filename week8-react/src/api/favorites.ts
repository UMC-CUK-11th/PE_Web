import { authApi } from "./auth-api";

// 즐겨찾기 목록의 영화 ID
export interface Favorite {
  movieId: number;
}

// 공통 API 응답
interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 즐겨찾기 목록 조회
export async function getFavorites(): Promise<Favorite[]> {
  const response = await authApi
    .get("favorites")
    .json<ApiResponse<Favorite[]>>();

  return response.result;
}

// 특정 영화 즐겨찾기 여부 조회
export async function getFavoriteStatus(movieId: number): Promise<boolean> {
  const response = await authApi
    .get(`favorites/${movieId}`)
    .json<ApiResponse<{ isFavorite: boolean }>>();

  return response.result.isFavorite;
}

// 즐겨찾기 추가
export async function addFavorite(movieId: number): Promise<void> {
  await authApi.post("favorites", {
    json: { movieId },
  });
}

// 즐겨찾기 삭제
export async function deleteFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`);
}
