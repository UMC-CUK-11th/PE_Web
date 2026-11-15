import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/member";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,

    onSuccess: () => {
      alert("회원가입이 완료되었습니다.");
      navigate({ to: "/login" });
    },

    onError: () => {
      alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
    },
  });
}
