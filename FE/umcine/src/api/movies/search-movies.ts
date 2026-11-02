import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesRequest { query: string; page?: number }
type SearchMoviesResponse = TmdbMovieListResponse;

function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return tmdbClient.get("search/movie", {
    searchParams: { query, page, language: "ko-KR", include_adult: false },
  }).json<SearchMoviesResponse>();
}
export { searchMovies, type SearchMoviesRequest, type SearchMoviesResponse };
