import { getTmdbAccessToken } from "./tmdb-client";
import type { TmdbMovieSummary, TmdbPaginatedResponse } from "../types/tmdb";

export async function fetchPopularMoviesWithFetch(page = 1, signal?: AbortSignal) {
  const url = new URL("https://api.themoviedb.org/3/movie/popular");
  url.searchParams.set("language", "ko-KR");
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${getTmdbAccessToken()}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`인기 영화 요청에 실패했습니다. (${response.status})`);
  }

  return response.json() as Promise<TmdbPaginatedResponse<TmdbMovieSummary>>;
}
