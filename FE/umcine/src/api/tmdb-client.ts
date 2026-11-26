import ky from "ky";

let tmdbClient: ReturnType<typeof ky.create> | undefined;

// Credentials are attached only by the same-origin server Route Handler.
export function getTmdbClient() {
  tmdbClient ??= ky.create({
    baseUrl: "/api/tmdb/",
  });
  return tmdbClient;
}
