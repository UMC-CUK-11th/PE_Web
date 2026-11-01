import { isHTTPError } from "ky";
import { env } from "../../config/env";

export function getRequestErrorMessage(error: unknown) {
  if (!env.tmdbAccessToken) return "FE/.env.local에 TMDB 토큰을 입력하고 개발 서버를 다시 시작해 주세요.";
  if (isHTTPError(error)) {
    if (error.response.status === 401) return "TMDB 인증에 실패했어요. API Read Access Token을 확인해 주세요.";
    if (error.response.status === 429) return "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.";
  }
  return "영화 정보를 불러오지 못했어요. 네트워크 연결을 확인하고 다시 시도해 주세요.";
}
export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) return "영화를 찾을 수 없어요.";
  return getRequestErrorMessage(error);
}
