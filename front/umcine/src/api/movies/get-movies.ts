import ky from "ky";
import type { TmdbMovieListResponse } from "./models";

interface GetMoviesRequest {
  page?: number;
}

type GetMoviesResponse = TmdbMovieListResponse;

function getMovies({ page = 1 }: GetMoviesRequest = {}) {
  return ky
    .get("/api/movies/popular", { searchParams: { page } })
    .json<GetMoviesResponse>();
}

export { getMovies, type GetMoviesRequest, type GetMoviesResponse };
