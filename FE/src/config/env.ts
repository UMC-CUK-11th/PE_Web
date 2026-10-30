// VITE_ 변수는 브라우저에 포함된다. 실제 토큰은 Git에서 제외되는 .env.local에 작성한다.
export const env = {
  backendApiBaseUrl: import.meta.env.VITE_BACKEND_API_BASE_URL?.trim() || "http://localhost:8080",
  tmdbApiBaseUrl: import.meta.env.VITE_TMDB_API_BASE_URL?.trim() ?? "",
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim() ?? "",
};

// 모듈을 읽을 때가 아닌 요청 직전에 검사해 토큰이 없어도 안내 화면을 표시한다.
export function validateTmdbEnv() {
  if (!env.tmdbApiBaseUrl || !env.tmdbAccessToken) {
    throw new Error("FE/.env.local에 TMDB 환경 변수를 설정하고 개발 서버를 다시 시작해 주세요.");
  }
}
