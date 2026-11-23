import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      alert("회원가입에 성공했어요. 로그인해 주세요.");
      navigate({ to: "/login" });
    },
    onError: () => {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
