import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/member";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,

    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      router.push("/login");
    },

    onError: () => {
      alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
    },
  });
}

