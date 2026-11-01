import { tmdbApi } from "./tmdb-client";
import type { TmdbMovieDetails, TmdbMovieSummary, TmdbPaginatedResponse } from "../types/tmdb";

const commonSearchParams = {
  language: "ko-KR",
};

export function getPopularMovies(page: number, signal?: AbortSignal) {
  return tmdbApi
    .get("movie/popular", {
      searchParams: { ...commonSearchParams, page },
      signal,
    })
    .json<TmdbPaginatedResponse<TmdbMovieSummary>>();
}

export function searchMovies(query: string, page: number, signal?: AbortSignal) {
  return tmdbApi
    .get("search/movie", {
      searchParams: {
        ...commonSearchParams,
        include_adult: false,
        query,
        page,
      },
      signal,
    })
    .json<TmdbPaginatedResponse<TmdbMovieSummary>>();
}

export function getMovieDetails(movieId: number, signal?: AbortSignal) {
  return tmdbApi
    .get(`movie/${movieId}`, {
      searchParams: commonSearchParams,
      signal,
    })
    .json<TmdbMovieDetails>();
}
