import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({ mutationFn: login,
    onSuccess: async response => {
      useAuthStore.getState().setAccessToken(response.result.accessToken);
      await queryClient.invalidateQueries({ queryKey: ["members", "me"] });
      await navigate({ to: "/" });
    },
  });
}
