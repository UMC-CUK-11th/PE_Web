import ky from "ky";
import { env, validateTmdbEnv } from "../config/env";

export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl.replace(/\/+$/, "")}/`,
  headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
  hooks: { beforeRequest: [() => { validateTmdbEnv(); }] },
});
