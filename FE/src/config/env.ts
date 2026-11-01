export const env = {
  tmdbApiBaseUrl: (import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3").replace(/\/+$/, ""),
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim() || "",
};

export function requireTmdbToken() {
  if (!env.tmdbAccessToken) {
    throw new Error("FE/.env.local에 TMDB API Read Access Token을 입력하고 개발 서버를 다시 시작해 주세요.");
  }
}
