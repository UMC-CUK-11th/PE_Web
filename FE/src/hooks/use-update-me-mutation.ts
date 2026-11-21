import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 수정된 내 정보가 통째로 있으므로 다시 조회하지 않고 캐시를 직접 바꿈
      queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
      alert("내 정보 수정에 성공했어요.");
      router.push("/my");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
