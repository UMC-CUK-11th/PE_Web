"use client";

import ky from "ky";
import { env } from "../config/env";
import { useAuthStore } from "../stores/auth-store";

export const apiClient = ky.create({
  baseUrl: env.apiBaseUrl,
  headers: { accept: "application/json" },
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) request.headers.set("Authorization", `Bearer ${accessToken}`);
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) useAuthStore.getState().clearSession();
      },
    ],
  },
  retry: 0,
  timeout: 10_000,
});
