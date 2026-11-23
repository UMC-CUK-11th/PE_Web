import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";

export function AuthSession() {
  const token = useAuthStore(state => state.accessToken);
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!token) {
      for (const queryKey of [["members", "me"], ["favorites"], ["ratings", "mine"]]) {
        void queryClient.cancelQueries({ queryKey });
        queryClient.removeQueries({ queryKey });
      }
    }
    void router.invalidate();
  }, [token, router, queryClient]);
  return null;
}
