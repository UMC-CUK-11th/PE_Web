import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import type { SignupRequest, SignupResponse } from "../api/members/signup";
import { signupOptions } from "../api/mutation-options";
export function useSignupMutation(callbacks: Pick<UseMutationOptions<SignupResponse, Error, SignupRequest>, "onSuccess" | "onError" | "onSettled"> = {}) {
  return useMutation({ ...signupOptions(), ...callbacks });
}
