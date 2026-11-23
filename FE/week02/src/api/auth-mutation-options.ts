import { mutationOptions } from "@tanstack/react-query";
import { login } from "./auth-api";

export function loginMutationOptions() {
  return mutationOptions({
    mutationKey: ["auth", "login"],
    mutationFn: login,
  });
}
