import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";
export function getMovieDetail(movieId: string, signal?: AbortSignal) {
  if (!/^[1-9]\d*$/.test(movieId) || !Number.isSafeInteger(Number(movieId))) {
    return Promise.reject(new Error("잘못된 영화 ID예요. 양의 정수 ID를 입력해 주세요."));
  }
  return tmdbClient.get(`movie/${movieId}`, { signal }).json<TmdbMovieDetail>();
}
