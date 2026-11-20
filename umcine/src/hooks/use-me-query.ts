import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";
export function useMeQuery() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({ queryKey: ["members", "me", token], queryFn: getMe, enabled: Boolean(token), staleTime: 300000, retry: false });
}
