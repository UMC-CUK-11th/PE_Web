import type { TmdbMovieListResponse } from "./models";

export async function getMoviesWithFetch(
  page = 1,
): Promise<TmdbMovieListResponse> {
  const params = new URLSearchParams({ language: "ko-KR", page: String(page) });
  const response = await fetch(`/api/tmdb/movie/popular?${params}`);
  if (!response.ok) throw new Error(`인기 영화 요청 실패 (${response.status})`);
  return response.json() as Promise<TmdbMovieListResponse>;
}
