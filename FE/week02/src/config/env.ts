const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8080";

export const env = {
  apiBaseUrl: apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`,
};
