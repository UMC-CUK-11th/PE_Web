import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? "http://localhost:8080",
    NEXT_PUBLIC_TMDB_API_BASE_URL: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL ?? process.env.VITE_TMDB_API_BASE_URL ?? "",
    NEXT_PUBLIC_TMDB_ACCESS_TOKEN: process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN ?? process.env.VITE_TMDB_ACCESS_TOKEN ?? "",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
