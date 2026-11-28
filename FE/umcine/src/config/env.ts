export const env = {
  tmdbApiBaseUrl: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL || "https://api.themoviedb.org/3",
  tmdbAccessToken: process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || "",
  apiBaseUrl: (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080"
  ).replace(/\/+$/, ""),
};
