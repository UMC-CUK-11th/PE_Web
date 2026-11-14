import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// 로그인이 필요한 요청용: 저장된 토큰을 Authorization 헤더에 자동으로 붙임
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
