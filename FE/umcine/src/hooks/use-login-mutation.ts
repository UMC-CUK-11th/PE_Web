"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login } from "../api/auth/login";
import { useAuthStore } from "../stores/auth-store";
import { memberInfoKey } from "./use-member-info";

export function useLoginMutation() {
  const client = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    gcTime: 0,
    onSuccess: async ({ result, message }) => {
      useAuthStore.getState().setAccessToken(result.accessToken);
      await client.invalidateQueries({ queryKey: memberInfoKey });
      if (useAuthStore.getState().accessToken !== result.accessToken) return;
      window.alert(message || "로그인했어요.");
      router.replace("/");
    },
  });
}
