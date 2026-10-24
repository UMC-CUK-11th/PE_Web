// Validate at request time so /api-test remains usable without a TMDB token.
export const env = {
  get tmdbApiBaseUrl(): string {
    const value = import.meta.env.VITE_TMDB_API_BASE_URL;
    if (!value) throw new Error("TMDB 환경 변수가 필요해요.");
    return value.replace(/\/+$/, "");
  },
  get tmdbAccessToken(): string {
    const value = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
    if (!value) throw new Error("TMDB 환경 변수가 필요해요.");
    return value;
  },
};
