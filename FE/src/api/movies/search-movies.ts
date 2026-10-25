import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieList } from "./models";
export function searchMovies(query: string, signal?: AbortSignal): Promise<TmdbMovieList> {
  if (!query.trim()) return Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 });
  return tmdbClient.get("search/movie", { searchParams: { query: query.trim(), include_adult: false }, signal }).json<TmdbMovieList>();
}
