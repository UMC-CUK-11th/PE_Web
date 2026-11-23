import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { createMovieRecord, createRating, deleteRating, updateRating } from "../../api/ratings";
import type { RatingResponse } from "../../api/members";
import { useMemberId, useMyRatingsQuery } from "../../hooks/use-member-queries";
import { useAuthStore } from "../../stores/auth-store";
import { apiErrorMessage } from "../../utils/api-error-message";

export function RatingPanel({ movieId }: { movieId: number }) {
  const token = useAuthStore(state => state.accessToken);
  const ratings = useMyRatingsQuery();
  const existing = ratings.data?.find(rating => rating.movieId === movieId);
  return <section className="mx-auto max-w-[1200px] px-5 py-10">
    <h2 className="mb-5 text-2xl font-bold">내 평점</h2>
    {!token ? <p><Link to="/login" className="text-red-400 underline">로그인</Link> 후 평점을 남길 수 있어요.</p>
      : ratings.isLoading ? <p role="status">내 평점을 불러오는 중이에요.</p>
      : ratings.isError ? <p role="alert">{apiErrorMessage(ratings.error)}</p>
      : <RatingForm key={existing?.ratingId ?? "new"} movieId={movieId} existing={existing} />}
  </section>;
}

function RatingForm({ movieId, existing }: { movieId: number; existing?: RatingResponse }) {
  const [score, setScore] = useState(existing?.score ?? 5);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [addToFavorites, setAddToFavorites] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const memberId = useMemberId();
  const mutation = useMutation({
    mutationFn: async (action: "save" | "delete") => {
      if (action === "delete" && existing) return void await deleteRating(existing.ratingId);
      if (existing) return void await updateRating(existing.ratingId, { score, comment });
      if (addToFavorites) return void await createMovieRecord({ movieId, score, comment, addToFavorites: true });
      return void await createRating({ movieId, score, comment });
    },
    onSuccess: async (_data, action) => {
      setMessage(action === "delete" ? "평점을 삭제했어요." : "평점을 저장했어요.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["ratings", "mine", memberId] }),
        queryClient.invalidateQueries({ queryKey: ["favorites", memberId] }),
      ]);
    },
    onError: error => setMessage(apiErrorMessage(error)),
  });
  return <form className="max-w-xl space-y-4 rounded-xl bg-[#202229] p-6" onSubmit={event => {
    event.preventDefault();
    if (!mutation.isPending && comment.length <= 500) mutation.mutate("save");
  }}>
    <div><label htmlFor="rating-score" className="mb-2 block">별점</label>
      <select id="rating-score" value={score} onChange={event => setScore(Number(event.target.value))} disabled={mutation.isPending} className="rounded border border-gray-600 bg-[#141517] p-3">
        {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value}점</option>)}
      </select></div>
    <div><label htmlFor="rating-comment" className="mb-2 block">감상평</label>
      <textarea id="rating-comment" value={comment} onChange={event => setComment(event.target.value)} maxLength={500} disabled={mutation.isPending} className="w-full rounded border border-gray-600 bg-[#141517] p-3" /></div>
    {!existing && <label className="flex items-center gap-2"><input type="checkbox" checked={addToFavorites} onChange={event => setAddToFavorites(event.target.checked)} disabled={mutation.isPending} />즐겨찾기에도 함께 저장</label>}
    <div className="flex gap-3">
      <button disabled={mutation.isPending} className="rounded bg-red-600 px-5 py-3 disabled:opacity-40">{mutation.isPending ? "처리 중" : existing ? "평점 수정" : "평점 등록"}</button>
      {existing && <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate("delete")} className="rounded bg-gray-700 px-5 py-3 disabled:opacity-40">평점 삭제</button>}
    </div>
    <p role="status">{message}</p>
  </form>;
}
