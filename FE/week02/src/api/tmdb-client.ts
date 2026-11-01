import ky from "ky";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();

export function getTmdbAccessToken() {
  if (!accessToken) {
    throw new Error("TMDB 인증 정보가 없습니다. .env에 VITE_TMDB_ACCESS_TOKEN을 설정해 주세요.");
  }

  return accessToken;
}

export const tmdbApi = ky.create({
  baseUrl: `${TMDB_API_BASE_URL}/`,
  headers: {
    accept: "application/json",
  },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        request.headers.set("Authorization", `Bearer ${getTmdbAccessToken()}`);
      },
    ],
  },
  retry: 0,
  timeout: 10_000,
});
