import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, getMemberRatings, updateRating, type Rating } from "../api/ratings/ratings";

const ratingsKey = (memberId: number) => ["members", memberId, "ratings"] as const;

export function useMemberRatingsQuery(memberId: number | null) {
  return useQuery({
    queryKey: ratingsKey(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });
}

// 평점 응답에 저장된 결과가 담겨 오므로 목록을 다시 받지 않고 캐시를 직접 고친다
export function useRatingMutations(memberId: number) {
  const queryClient = useQueryClient();
  const setRatings = (update: (ratings: Rating[]) => Rating[]) =>
    queryClient.setQueryData<Rating[]>(ratingsKey(memberId), (ratings) => update(ratings ?? []));

  const create = useMutation({
    mutationFn: createRating,
    onSuccess: ({ result }) => setRatings((ratings) => [result, ...ratings]),
  });
  const update = useMutation({
    mutationFn: updateRating,
    onSuccess: ({ result }) =>
      setRatings((ratings) => ratings.map((rating) => (rating.ratingId === result.ratingId ? result : rating))),
  });
  // 삭제 응답의 result는 null이라 요청에 보낸 ratingId로 지운다
  const remove = useMutation({
    mutationFn: deleteRating,
    onSuccess: (_, ratingId) => setRatings((ratings) => ratings.filter((rating) => rating.ratingId !== ratingId)),
  });

  return { create, update, remove };
}
