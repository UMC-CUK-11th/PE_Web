import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import type { MemberInfo } from "../api/members/me";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,

    onSuccess: (response) => {
      // 수정된 회원 정보를 캐시에 즉시 반영
      queryClient.setQueryData<MemberInfo>(["members", "me"], response);

      alert("내 정보 수정에 성공했어요.");
    },

    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
