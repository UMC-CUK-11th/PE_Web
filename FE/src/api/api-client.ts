import ky from "ky";
import { env } from "../config/env";

// 회원 서버 요청에는 TMDB 토큰을 붙이지 않는다.
export const apiClient = ky.create({ baseUrl: env.apiBaseUrl });
