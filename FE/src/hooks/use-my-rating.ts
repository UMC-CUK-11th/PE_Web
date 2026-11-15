import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, getMemberRatings, updateRating, type RatingForm } from "../api/ratings";
import { useMeQuery } from "./use-me-query";

// 내 평점 목록을 받아서 이 영화의 평점만 골라냄
export function useMyRatingQuery(movieId: number) {
  const memberId = useMeQuery().data?.memberId;

  return useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== undefined, // 내 정보(memberId)를 받은 뒤에만 요청
    select: (ratings) => ratings.find((rating) => rating.movieId === movieId) ?? null,
  });
}

// 평점 등록/수정/삭제 공통: 성공하면 내 평점 목록을 다시 조회함
// (수정·삭제 응답의 result가 null이라 캐시를 직접 바꿀 정보가 없음)
function useRatingMutation<T>(mutationFn: (variables: T) => Promise<unknown>, successMessage: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ratings"] });
      alert(successMessage);
    },
    onError: () => {
      alert("평점 요청에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useCreateRatingMutation(movieId: number) {
  return useRatingMutation((form: RatingForm) => createRating(movieId, form), "평점을 등록했어요.");
}

export function useUpdateRatingMutation() {
  return useRatingMutation(
    ({ ratingId, form }: { ratingId: number; form: RatingForm }) => updateRating(ratingId, form),
    "평점을 수정했어요.",
  );
}

export function useDeleteRatingMutation() {
  return useRatingMutation((ratingId: number) => deleteRating(ratingId), "평점을 삭제했어요.");
}
