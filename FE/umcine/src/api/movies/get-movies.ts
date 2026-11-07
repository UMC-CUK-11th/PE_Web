import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export async function getMovies({
  page = 1,
  signal,
}: { page?: number; signal?: AbortSignal } = {}) {
  return getTmdbClient()
    .get("movie/popular", {
      searchParams: { language: "ko-KR", page },
      signal,
    })
    .json<TmdbMovieListResponse>();
}
