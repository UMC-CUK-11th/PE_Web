export function tmdbImage(path: string | null, size: "w500" | "w1280" = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
