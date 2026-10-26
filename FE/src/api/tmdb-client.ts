import ky from "ky";
import { env, requireTmdbToken } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
  timeout: 15000,
  hooks: { beforeRequest: [() => requireTmdbToken()] },
});
