import "server-only";
import ky from "ky";

const tmdbApiBaseUrl = process.env.TMDB_API_BASE_URL || "https://api.themoviedb.org/3";
const tmdbClient = ky.create({ baseUrl: tmdbApiBaseUrl.replace(/\/*$/, "/") });

export function getTmdbClient() {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  if (!accessToken) throw new Error("TMDB_ACCESS_TOKEN 환경 변수가 필요해요.");

  return tmdbClient.extend({ headers: { Authorization: `Bearer ${accessToken}` } });
}
