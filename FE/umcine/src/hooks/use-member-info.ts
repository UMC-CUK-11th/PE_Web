import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export const memberInfoKey = ["members", "me"] as const;

export function useMemberInfo() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: memberInfoKey,
    queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
