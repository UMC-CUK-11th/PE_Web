import { env, requireTmdbToken } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

export type GetMoviesWithFetchResponse = TmdbMovieListResponse;
export async function getMoviesWithFetch(page = 1): Promise<GetMoviesWithFetchResponse> {
  requireTmdbToken();
  const searchParams = new URLSearchParams({ language: "ko-KR", page: String(page) });
  const response = await fetch(`${env.tmdbApiBaseUrl}/movie/popular?${searchParams}`, {
    headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
  });
  if (!response.ok) throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  return response.json();
}
