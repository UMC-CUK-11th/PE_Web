import { HTTPError } from "ky";
export function getMovieDetailErrorMessage(error: unknown): string {
  if (error instanceof HTTPError) {
    if (error.response.status === 404) return "존재하지 않는 영화예요. 영화 목록에서 다시 선택해 주세요.";
    if (error.response.status === 401) return "TMDB 인증에 실패했어요. Read Access Token을 확인해 주세요.";
    return `영화 정보를 불러오지 못했어요. (HTTP ${error.response.status}) 잠시 후 다시 시도해 주세요.`;
  }
  if (error instanceof Error && (error.message.startsWith("TMDB 토큰") || error.message.startsWith("잘못된 영화"))) return error.message;
  return "영화 정보를 불러오지 못했어요. 네트워크 연결을 확인하고 다시 시도해 주세요.";
}
