import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { getFavorites } from "../api/favorites";
import { getMemberRatings } from "../api/ratings";
import { getTokenMemberId, useAuthStore } from "../stores/auth-store";

export function useMemberId() {
  return getTokenMemberId(useAuthStore(state => state.accessToken));
}
export function useMeQuery() {
  const token = useAuthStore(state => state.accessToken);
  const memberId = getTokenMemberId(token);
  return useQuery({ queryKey: ["members", "me", memberId], queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(token), staleTime: 5 * 60 * 1000, retry: false });
}
export function useFavoritesQuery() {
  const token = useAuthStore(state => state.accessToken);
  const memberId = getTokenMemberId(token);
  return useQuery({ queryKey: ["favorites", memberId, "list"], queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(token), retry: false });
}
export function useMyRatingsQuery() {
  const memberId = useMemberId();
  return useQuery({ queryKey: ["ratings", "mine", memberId],
    queryFn: ({ signal }) => getMemberRatings(memberId!, signal), enabled: memberId !== null, retry: false });
}
