import ky from "ky";
import { env } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  hooks: { beforeRequest: [() => { if (!env.tmdbAccessToken) throw new Error('영화 조회에는 TMDB 토큰 설정이 필요해요.'); }] },
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
