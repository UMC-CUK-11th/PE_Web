import { ApiError, apiRequest } from "./api-client";
import { useAuthStore } from "../stores/auth-store";

export async function authRequest<T>(path: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new ApiError(401, "AUTH_REQUIRED", "로그인 후 이용해 주세요.");
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const result = await apiRequest<T>(path, { ...options, headers }, (response) => {
    // 이전 계정의 늦은 401이 새 로그인까지 해제하지 않도록 요청 당시 토큰과 비교합니다.
    if (response.status === 401 && useAuthStore.getState().accessToken === token) useAuthStore.getState().expireSession();
  });
  if (useAuthStore.getState().accessToken !== token) throw new ApiError(409, "SESSION_CHANGED", "로그인 정보가 변경되었어요. 다시 시도해 주세요.");
  return result;
}
