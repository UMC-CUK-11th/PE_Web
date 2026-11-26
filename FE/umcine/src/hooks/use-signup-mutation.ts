"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signup } from "../api/members";

export function useSignupMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: signup,
    gcTime: 0,
    onSuccess: () => router.push("/login?registered=true"),
  });
}
