"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginOptions } from "../api/mutation-options";
import { meKey } from "../api/private-query-options";
import { useAuthStore } from "../stores/auth-store";
export function useLoginMutation(onSettled: () => void) {
  const client = useQueryClient();
  const navigate = useRouter();
  return useMutation({ ...loginOptions(), onSuccess: async (response) => {
    useAuthStore.getState().setAccessToken(response.result.accessToken);
    await client.invalidateQueries({ queryKey: meKey });
    navigate.replace("/");
  }, onSettled });
}
