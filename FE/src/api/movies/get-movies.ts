import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieList } from "./models";
export function getMovies(page = 1, signal?: AbortSignal) {
  return tmdbClient.get("movie/popular", { searchParams: { page }, signal }).json<TmdbMovieList>();
}
