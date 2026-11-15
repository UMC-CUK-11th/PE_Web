import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const redirect =
    new URLSearchParams(window.location.search).get("redirect") ?? undefined;

  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,

    onSuccess: (response) => {
      // 백엔드가 반환한 JWT를 Zustand에 저장
      setAccessToken(response.accessToken);

      void queryClient.invalidateQueries({
        queryKey: ["members", "me"],
      });

      alert("로그인에 성공했어요.");

      // 로그인 전 접근하려던 페이지로 이동
      const destination =
        redirect?.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : "/";

      window.location.replace(destination);
    },

    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
