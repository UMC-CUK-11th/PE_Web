import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { updateMe } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/models";
import { useAuthStore } from "../stores/auth-store";
import { memberInfoKey } from "./use-member-info";

export function useUpdateMeMutation() {
  const client = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateMe,
    onMutate: () => useAuthStore.getState().accessToken,
    onSuccess: async (response, _, token) => {
      if (!token || token !== useAuthStore.getState().accessToken) return;
      await client.cancelQueries({ queryKey: memberInfoKey, exact: true });
      if (token !== useAuthStore.getState().accessToken) return;
      client.setQueryData<MemberInfo>(memberInfoKey, response.result);
      await navigate({ to: "/my" });
    },
  });
}
