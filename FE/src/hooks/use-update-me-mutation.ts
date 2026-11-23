import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import { useMemberId } from "./use-member-queries";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const memberId = useMemberId();
  return useMutation({ mutationFn: updateMe,
    onSuccess: response => queryClient.setQueryData(["members", "me", memberId], response.result),
  });
}
