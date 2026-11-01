import { getTmdbToken, TMDB_BASE_URL } from "../../config/env";
import type { TmdbMovieList } from "./models";
export async function getMoviesWithFetch(signal?: AbortSignal): Promise<TmdbMovieList> {
  const response = await fetch(`${TMDB_BASE_URL}movie/popular?language=ko-KR&page=1`, {
    headers: { Authorization: `Bearer ${getTmdbToken()}`, Accept: "application/json" }, signal,
  });
  if (!response.ok) throw new Error(`인기 영화 요청 실패 (HTTP ${response.status})`);
  return response.json() as Promise<TmdbMovieList>;
}
