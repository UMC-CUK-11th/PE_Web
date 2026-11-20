import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { createRating, deleteRating, getMemberRatings, updateRating } from "./rating-api";

export const ratingQueryKeys = {
  all: ["ratings"] as const,
  member: (memberId: number) => [...ratingQueryKeys.all, "member", memberId] as const,
};

export function memberRatingsQueryOptions(memberId: number, enabled = true) {
  return queryOptions({
    queryKey: ratingQueryKeys.member(memberId),
    queryFn: () => getMemberRatings(memberId),
    enabled,
  });
}

export function createRatingMutationOptions() {
  return mutationOptions({
    mutationKey: [...ratingQueryKeys.all, "create"],
    mutationFn: createRating,
  });
}

export function updateRatingMutationOptions() {
  return mutationOptions({
    mutationKey: [...ratingQueryKeys.all, "update"],
    mutationFn: updateRating,
  });
}

export function deleteRatingMutationOptions() {
  return mutationOptions({
    mutationKey: [...ratingQueryKeys.all, "delete"],
    mutationFn: deleteRating,
  });
}
