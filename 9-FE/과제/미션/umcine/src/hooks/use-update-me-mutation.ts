import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 수정된 내 정보가 그대로 오니 다시 조회하지 않고 캐시에 넣는다
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
    },
  });
}
