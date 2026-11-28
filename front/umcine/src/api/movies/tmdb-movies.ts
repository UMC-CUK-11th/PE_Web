import { isHTTPError } from "ky";
import { getTmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail, TmdbMovieListResponse } from "./models";

export function getPopularMoviesFromTmdb(page: number) {
  return getTmdbClient()
    .get("movie/popular", { searchParams: { language: "ko-KR", page } })
    .json<TmdbMovieListResponse>();
}

export function searchMoviesOnTmdb(query: string, page: number) {
  return getTmdbClient()
    .get("search/movie", { searchParams: { query, language: "ko-KR", include_adult: false, page } })
    .json<TmdbMovieListResponse>();
}

export function getMovieDetailFromTmdb(movieId: number) {
  return getTmdbClient()
    .get(`movie/${movieId}`, { searchParams: { language: "ko-KR" } })
    .json<TmdbMovieDetail>();
}

export function tmdbErrorResponse(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return Response.json({ message: "영화를 찾을 수 없어요." }, { status: 404 });
  }

  return Response.json({ message: "영화 정보를 불러오지 못했어요." }, { status: 502 });
}
