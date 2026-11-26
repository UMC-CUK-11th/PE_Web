// The backend URL is public. TMDB credentials are read only in its Route Handler.
export const env = {
  get backendApiBaseUrl(): string {
    return (
      process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || "http://localhost:3000"
    ).replace(/\/+$/, "");
  },
};
