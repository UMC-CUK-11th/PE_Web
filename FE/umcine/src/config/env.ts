export const env = {
  tmdbApiBaseUrl: import.meta.env.VITE_TMDB_API_BASE_URL || "https://api.themoviedb.org/3",
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN || "",
  apiBaseUrl: (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_BACKEND_API_BASE_URL ||
    "http://localhost:8080"
  ).replace(/\/+$/, ""),
};
