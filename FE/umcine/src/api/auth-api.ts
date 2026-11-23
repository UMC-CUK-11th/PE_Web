import { apiClient } from "./api-client";
import { useAuthStore } from "../stores/auth-store";

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken)
          request.headers.set("Authorization", `Bearer ${accessToken}`);
      },
    ],
    afterResponse: [
      ({ request, response }) => {
        const { accessToken, setAccessToken } = useAuthStore.getState();
        // A response from an earlier session must not log out the current one.
        if (
          response.status === 401 &&
          accessToken &&
          request.headers.get("Authorization") === `Bearer ${accessToken}`
        ) {
          setAccessToken(null);
        }
      },
    ],
  },
});
