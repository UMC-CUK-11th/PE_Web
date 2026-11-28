import ky from "ky";
import type { TmdbMovieListResponse } from "./models";

interface SearchMoviesRequest {
  query: string;
  page?: number;
}

type SearchMoviesResponse = TmdbMovieListResponse;

function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return ky
    .get("/api/movies/search", { searchParams: { query, page } })
    .json<SearchMoviesResponse>();
}

export {
  searchMovies,
  type SearchMoviesRequest,
  type SearchMoviesResponse,
};
