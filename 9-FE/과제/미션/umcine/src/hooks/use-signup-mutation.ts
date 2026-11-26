import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members/signup";

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      router.push("/login?signedUp=true");
    },
  });
}
