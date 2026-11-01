import { env, validateTmdbEnv } from "../../config/env";
import type { TmdbMovieListResponse } from "./models";

export type GetMoviesWithFetchResponse = TmdbMovieListResponse;

export async function getMoviesWithFetch(page = 1): Promise<GetMoviesWithFetchResponse> {
  validateTmdbEnv();
  const searchParams = new URLSearchParams({ language: "ko-KR", page: String(page) });
  const response = await fetch(
    `${env.tmdbApiBaseUrl.replace(/\/+$/, "")}/movie/popular?${searchParams}`,
    { headers: { Authorization: `Bearer ${env.tmdbAccessToken}` } },
  );

  // fetch는 404·500 응답도 resolve하므로 HTTP 성공 여부를 직접 검사한다.
  if (!response.ok) {
    throw new Error(`영화 목록 요청에 실패했어요: ${response.status}`);
  }
  return response.json();
}
