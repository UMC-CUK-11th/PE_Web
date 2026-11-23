import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMemberRatings, type RatingResponse } from "../api/members";
import {
  createRating,
  deleteRating,
  updateRating,
  type RatingInput,
} from "../api/ratings";
import { useAuthStore } from "../stores/auth-store";

const memberRatingsKey = (id: number) => ["ratings", "member", id] as const;

export function useMemberRatings(memberId: number) {
  return useQuery({
    queryKey: memberRatingsKey(memberId),
    queryFn: ({ signal }) => getMemberRatings(memberId, signal),
    retry: false,
  });
}

type RatingChange =
  | { action: "create"; input: RatingInput }
  | { action: "update"; ratingId: number; input: RatingInput }
  | { action: "delete"; ratingId: number };

export function useRatingMutation(memberId: number, movieId: number) {
  const client = useQueryClient();
  const queryKey = memberRatingsKey(memberId);

  return useMutation({
    mutationFn: async (change: RatingChange) => {
      switch (change.action) {
        case "create":
          return createRating({ ...change.input, movieId });
        case "update":
          return updateRating(change.ratingId, change.input);
        case "delete":
          await deleteRating(change.ratingId);
          return null;
      }
    },
    onMutate: () => useAuthStore.getState().accessToken,
    onSuccess: async (rating, change, token) => {
      if (!token || token !== useAuthStore.getState().accessToken) return;
      await client.cancelQueries({ queryKey, exact: true });
      if (token !== useAuthStore.getState().accessToken) return;
      client.setQueryData<RatingResponse[]>(queryKey, (ratings = []) => {
        if (change.action === "delete") {
          return ratings.filter(({ ratingId }) => ratingId !== change.ratingId);
        }
        if (!rating) return ratings;
        if (change.action === "create") {
          return [
            ...ratings.filter((item) => item.ratingId !== rating.ratingId),
            rating,
          ];
        }
        return ratings.map((item) =>
          item.ratingId === rating.ratingId ? rating : item,
        );
      });
    },
  });
}
