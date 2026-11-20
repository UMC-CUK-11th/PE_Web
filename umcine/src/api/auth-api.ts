import { useAuthStore } from '../stores/auth-store';
import { apiClient } from './api-client';

export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      /* 요청을 보내기 전에 최신 토큰을 읽어 헤더에 넣음 */
      ({ request }) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      /* 인증에 실패한 401 응답을 받으면 토큰을 비움 */
      ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
