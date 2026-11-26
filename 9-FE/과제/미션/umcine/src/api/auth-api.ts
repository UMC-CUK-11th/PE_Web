import { useAuthStore } from "../stores/auth-store";
import { umcClient } from "./umc-client";

// 기존 umcClient 설정을 이어받고 인증 헤더만 더한다
export const authApi = umcClient.extend({
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
        // 만료되거나 잘못된 토큰이면 비워서 로그인 전 상태로 돌린다
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
