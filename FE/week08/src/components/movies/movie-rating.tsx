import { useState, type SubmitEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { addRating, getMemberRatings, removeRating, updateRating, type Rating, type RatingBody } from "../../api/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberId } from "../../utils/auth/get-member-id";

interface MovieRatingProps {
  movieId: number;
}

export function MovieRating({ movieId }: MovieRatingProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const queryClient = useQueryClient();
  const queryKey = ["ratings", "member", memberId] as const;
  const ratingsQuery = useQuery({
    queryKey,
    queryFn: () => getMemberRatings(memberId!),
    enabled: memberId !== null,
  });
  const currentRating = ratingsQuery.data?.find((rating) => rating.movieId === movieId);
  const [draft, setDraft] = useState<RatingBody | null>(null);
  const score = draft?.score ?? currentRating?.score ?? 5;
  const comment = draft?.comment ?? currentRating?.comment ?? "";

  const saveMutation = useMutation({
    mutationFn: (body: RatingBody) => currentRating
      ? updateRating(currentRating.ratingId, body)
      : addRating(movieId, body),
    onSuccess: (saved) => {
      queryClient.setQueryData<Rating[]>(queryKey, (old) => {
        if (!old) return [saved];
        return currentRating
          ? old.map((rating) => rating.ratingId === saved.ratingId ? saved : rating)
          : [saved, ...old];
      });
      setDraft(null);
    },
    onError: () => alert("평점을 저장하지 못했어요. 다시 시도해 주세요."),
  });
  const deleteMutation = useMutation({
    mutationFn: () => removeRating(currentRating!.ratingId),
    onSuccess: () => {
      queryClient.setQueryData<Rating[]>(queryKey, (old) => old?.filter((rating) => rating.ratingId !== currentRating?.ratingId));
      setDraft(null);
    },
    onError: () => alert("평점을 삭제하지 못했어요. 다시 시도해 주세요."),
  });
  const isBusy = saveMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isBusy && Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500) {
      saveMutation.mutate({ score, comment: comment.trim() });
    }
  };

  return (
    <section className="relative mx-auto w-[min(calc(100%-80px),1200px)] pb-12 text-white" aria-labelledby="rating-title">
      <h2 id="rating-title" className="mb-4 text-2xl font-bold">내 평점</h2>
      {!accessToken ? (
        <p><Link className="text-[#8fb4ff]" to="/login">로그인</Link>하면 평점을 남길 수 있어요.</p>
      ) : memberId === null ? (
        <p role="alert">회원 번호를 확인할 수 없어요. 다시 로그인해 주세요.</p>
      ) : ratingsQuery.isPending ? (
        <p role="status">내 평점을 불러오는 중이에요.</p>
      ) : ratingsQuery.isError ? (
        <button type="button" className="text-[#8fb4ff]" onClick={() => void ratingsQuery.refetch()}>평점을 불러오지 못했어요. 다시 시도</button>
      ) : (
        <form className="max-w-[700px] space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <label htmlFor="rating-score">별점</label>
            <select id="rating-score" className="rounded-lg border border-white/30 bg-[#20242c] px-3 py-2" value={score} disabled={isBusy} onChange={(event) => setDraft({ score: Number(event.target.value), comment })}>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}점</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block" htmlFor="rating-comment">후기</label>
            <textarea id="rating-comment" className="min-h-28 w-full rounded-lg border border-white/30 bg-[#20242c] p-3" maxLength={500} value={comment} disabled={isBusy} onChange={(event) => setDraft({ score, comment: event.target.value })} placeholder="이 영화에 대한 생각을 적어 주세요." />
            <p className="text-right text-xs text-white/60">{comment.length}/500</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="rounded-lg bg-[#2669ee] px-5 py-2 font-bold disabled:opacity-50" disabled={isBusy}>{saveMutation.isPending ? "저장 중" : currentRating ? "평점 수정" : "평점 등록"}</button>
            {currentRating && <button type="button" className="rounded-lg border border-white/40 px-5 py-2 disabled:opacity-50" disabled={isBusy} onClick={() => deleteMutation.mutate()}>{deleteMutation.isPending ? "삭제 중" : "평점 삭제"}</button>}
          </div>
        </form>
      )}
    </section>
  );
}
