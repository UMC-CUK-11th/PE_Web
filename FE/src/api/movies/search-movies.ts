import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export interface SearchMoviesRequest { query: string; page?: number }
export type SearchMoviesResponse = TmdbMovieListResponse;

export function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return tmdbClient.get("search/movie", {
    searchParams: { query, language: "ko-KR", include_adult: false, page },
  }).json<SearchMoviesResponse>();
}
