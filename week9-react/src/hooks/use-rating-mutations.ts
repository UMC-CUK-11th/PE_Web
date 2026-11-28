import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating, updateRating, deleteRating } from "../api/ratings";
import type { CreateRatingRequest, UpdateRatingRequest } from "../api/ratings";

export function useRatingMutations(memberId?: number) {
  const queryClient = useQueryClient();

  // 평점 변경 후 목록 캐시 갱신
  const refreshRatings = async () => {
    if (memberId !== undefined) {
      await queryClient.invalidateQueries({
        queryKey: ["ratings", "member", memberId],
      });
    }
  };

  // 평점 등록
  const createMutation = useMutation({
    mutationFn: (request: CreateRatingRequest) => createRating(request),

    onSuccess: refreshRatings,
  });

  // 평점 수정
  const updateMutation = useMutation({
    mutationFn: ({
      ratingId,
      request,
    }: {
      ratingId: number;
      request: UpdateRatingRequest;
    }) => updateRating(ratingId, request),

    onSuccess: refreshRatings,
  });

  // 평점 삭제
  const deleteMutation = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),

    onSuccess: refreshRatings,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,

    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}
