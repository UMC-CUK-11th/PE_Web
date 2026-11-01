import ky from "ky";
import { getTmdbToken, TMDB_BASE_URL } from "../config/env";
export const tmdbClient = ky.create({
  baseUrl: TMDB_BASE_URL,
  searchParams: { language: "ko-KR" },
  timeout: 15000,
  retry: 0,
  hooks: {
    beforeRequest: [({ request }) => {
      request.headers.set("Authorization", `Bearer ${getTmdbToken()}`);
      request.headers.set("Accept", "application/json");
    }],
  },
});
