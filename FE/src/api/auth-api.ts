import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [({ request }) => {
      const token = useAuthStore.getState().accessToken;
      if (token) request.headers.set("Authorization", `Bearer ${token}`);
    }],
    afterResponse: [({ request, response }) => {
      const { accessToken, setAccessToken } = useAuthStore.getState();
      if (response.status === 401 && request.headers.get("Authorization") === `Bearer ${accessToken}`) {
        setAccessToken(null);
      }
    }],
  },
});
