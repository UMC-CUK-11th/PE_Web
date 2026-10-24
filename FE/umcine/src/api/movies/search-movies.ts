import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";

export async function searchMovies({
  query,
  page = 1,
  signal,
}: {
  query: string;
  page?: number;
  signal?: AbortSignal;
}) {
  return getTmdbClient()
    .get("search/movie", {
      searchParams: { query, language: "ko-KR", include_adult: false, page },
      signal,
    })
    .json<TmdbMovieListResponse>();
}
