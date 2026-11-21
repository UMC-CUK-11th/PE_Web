import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { memberRequestError, signUp } from "../api/member-client";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
      alert(response.message);
      router.push("/login");
    },
    onError: (error) => {
      alert(memberRequestError(error));
    },
  });
}
