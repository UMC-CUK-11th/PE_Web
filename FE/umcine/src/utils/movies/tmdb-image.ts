const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

export function getTmdbPosterUrl(path: string | null): string | null {
  return path ? `${TMDB_POSTER_BASE_URL}${path}` : null;
}

export function getTmdbBackdropUrl(path: string | null): string | null {
  return path ? `${TMDB_BACKDROP_BASE_URL}${path}` : null;
}
