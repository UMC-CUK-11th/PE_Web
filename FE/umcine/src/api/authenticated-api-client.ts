import { apiClient } from "./api-client";
import { useAuthStore } from "../stores/auth-store";

export const authenticatedApiClient = apiClient.extend({
  retry: 0,
  hooks: {
    beforeRequest: [({ request }) => {
      const session = useAuthStore.getState().session;
      if (!session) throw new Error("로그인 후 이용해 주세요.");
      request.headers.set("Authorization", `Bearer ${session.accessToken}`);
    }],
    afterResponse: [({ request, response }) => {
      const session = useAuthStore.getState().session;
      // 예전 요청의 401 응답으로 새로 로그인한 세션이 지워지지 않게 합니다.
      if (response.status === 401 && session &&
        request.headers.get("Authorization") === `Bearer ${session.accessToken}`) {
        useAuthStore.getState().clearSession("로그인이 만료되었거나 유효하지 않아요. 다시 로그인해 주세요.");
      }
    }],
  },
});
