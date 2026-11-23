import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { useMemberPreviewStore } from "../stores/member-preview-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const updateProfile = useMemberPreviewStore((state) => state.updateProfile);

  return useMutation({
    mutationFn: login,
    onSuccess: (response, variables) => {
      queryClient.removeQueries({ queryKey: ["ratings"] });
      queryClient.removeQueries({ queryKey: ["favorites"] });
      updateProfile({
        email: variables.email,
        nickname: response.result.nickname,
      });
      setAccessToken(response.result.accessToken);
      queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      navigate({ to: "/" });
    },
    onError: () => {
      alert("로그인에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
