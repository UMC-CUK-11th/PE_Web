import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setAccessToken(response.result.accessToken);
      // 내 정보와 즐겨찾기는 로그인한 사람에 따라 달라지니 다시 조회하게 한다
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      navigate({ to: "/" });
    },
  });
}
