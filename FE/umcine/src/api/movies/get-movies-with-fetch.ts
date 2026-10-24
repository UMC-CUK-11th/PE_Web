import { env } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

export async function getMoviesWithFetch(
  page = 1,
): Promise<TmdbMovieListResponse> {
  const params = new URLSearchParams({ language: "ko-KR", page: String(page) });
  const response = await fetch(
    `${env.tmdbApiBaseUrl}/movie/popular?${params}`,
    {
      headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
    },
  );
  if (!response.ok) throw new Error(`인기 영화 요청 실패 (${response.status})`);
  return response.json() as Promise<TmdbMovieListResponse>;
}
