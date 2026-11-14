import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { signup } from "../api/members";

export function useSignupMutation() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signup,
    gcTime: 0,
    onSuccess: () => navigate({ to: "/login", search: { registered: true } }),
  });
}
