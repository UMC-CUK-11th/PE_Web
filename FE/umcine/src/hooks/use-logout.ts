import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../stores/auth-store";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return () => {
    setAccessToken(null);
    // 다음에 로그인하는 사람에게 이전 사람의 정보가 보이지 않도록 캐시를 지워요.
    queryClient.removeQueries({ queryKey: queryKeys.me });
    queryClient.removeQueries({ queryKey: queryKeys.favorites });
    navigate({ to: "/" });
  };
}
