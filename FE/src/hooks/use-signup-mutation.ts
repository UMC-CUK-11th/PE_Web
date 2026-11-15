import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { memberRequestError, signUp } from "../api/member-client";

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
      alert(response.message);
      navigate({ to: "/login" });
    },
    onError: (error) => {
      alert(memberRequestError(error));
    },
  });
}
