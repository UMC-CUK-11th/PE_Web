import ky from "ky";
import { env } from "../config/env";

let tmdbClient: ReturnType<typeof ky.create> | undefined;

// Lazy initialization lets pages render configuration errors instead of crashing.
export function getTmdbClient() {
  tmdbClient ??= ky.create({
    baseUrl: `${env.tmdbApiBaseUrl}/`,
    headers: { Authorization: `Bearer ${env.tmdbAccessToken}` },
  });
  return tmdbClient;
}
