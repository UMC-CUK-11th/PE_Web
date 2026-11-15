import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { getMemberRatings } from "../api/ratings";

export function useMyRatings(enabled = true) {
  const memberQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled,
  });

  const memberId = memberQuery.data?.id;

  const ratingsQuery = useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: enabled && memberId !== undefined,
  });

  return {
    ...ratingsQuery,
    memberId,
  };
}
