import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { meOptions, ratingsKey, ratingsOptions } from "../../api/private-query-options";
import { writeRatingOptions } from "../../api/mutation-options";
import { memberErrorMessage } from "../../api/api-client";
import type { RatingResponse } from "../../api/member-client";
import { inputStyle, primaryButtonStyle } from "../auth/form-styles";

export function RatingPanel({ movieId }: { movieId: number }) {
  const { accessToken, sessionVersion } = useAuthStore();
  const me = useQuery(meOptions());
  const ratings = useQuery(ratingsOptions(sessionVersion, me.data?.memberId ?? 0));
  const [message, setMessage] = useState("");
  if (!accessToken) return <aside className="pt-8"><h2 className="font-bold">내 별점</h2><Link to="/login" className="mt-4 inline-block text-sm text-blue-700">로그인하고 평점을 남겨 보세요.</Link></aside>;
  if (me.isLoading || ratings.isLoading) return <aside className="pt-8" role="status">내 평점을 불러오는 중이에요.</aside>;
  if (me.isError || ratings.isError || !me.data) return <aside className="pt-8"><p role="alert">{memberErrorMessage(me.error ?? ratings.error)}</p><button className="mt-3 text-blue-700" onClick={() => { void me.refetch(); void ratings.refetch(); }}>다시 시도</button></aside>;
  const existing = ratings.data?.find((item) => item.movieId === movieId);
  return <aside className="min-w-0 pt-8" aria-label="별점 남기기"><h2 className="text-lg font-bold">내 별점</h2>
    {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
    <RatingForm key={existing?.ratingId ?? "new"} existing={existing} movieId={movieId} memberId={me.data.memberId} session={sessionVersion} feedback={setMessage} />
  </aside>;
}

function RatingForm({ existing, movieId, memberId, session, feedback }: { existing?: RatingResponse; movieId: number; memberId: number; session: number; feedback: (message: string) => void }) {
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const lock = useRef(false);
  const client = useQueryClient();
  const mutation = useMutation({ ...writeRatingOptions(), onSuccess: async (_response, action) => {
    feedback(action.kind === "delete" ? "평점을 삭제했어요." : action.kind === "update" ? "평점을 수정했어요." : "평점을 등록했어요.");
    await client.invalidateQueries({ queryKey: ratingsKey(session, memberId) });
  }, onSettled: () => { lock.current = false; } });
  const valid = score >= 1 && score <= 5 && comment.length <= 500;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || mutation.isPending || lock.current) return;
    lock.current = true;
    mutation.mutate(existing ? { kind: "update", ratingId: existing.ratingId, score, comment } : { kind: "create", movieId, score, comment });
  }
  function remove() {
    if (!existing || lock.current || mutation.isPending) return;
    lock.current = true;
    mutation.mutate({ kind: "delete", ratingId: existing.ratingId });
  }
  return <form onSubmit={submit} noValidate className="mt-4 space-y-4">
    <div className="flex gap-2" aria-label="별점 선택">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value} disabled={mutation.isPending} onClick={() => { setScore(value); mutation.reset(); feedback(""); }} className={`text-2xl ${value <= score ? "text-amber-500" : "text-slate-300"}`}>★</button>)}</div>
    <p className="text-xs text-slate-500">{score ? `${score}점 선택` : "1~5점 중 선택해 주세요."}</p>
    <div><label htmlFor="rating-comment" className="mb-2 block text-sm font-bold">후기</label><textarea id="rating-comment" className={inputStyle} rows={4} value={comment} disabled={mutation.isPending} aria-invalid={comment.length > 500} aria-describedby="rating-comment-help" placeholder="이 영화는 어떠셨나요?" onChange={(event) => { setComment(event.target.value); mutation.reset(); feedback(""); }} /><p id="rating-comment-help" className={`mt-1 text-xs ${comment.length > 500 ? "text-red-600" : "text-slate-500"}`}>{comment.length}/500자</p></div>
    {mutation.isError && <p role="alert" className="text-sm text-red-600">{memberErrorMessage(mutation.error)}</p>}
    <button type="submit" className={primaryButtonStyle} disabled={!valid || mutation.isPending}>{mutation.isPending ? "처리 중…" : existing ? "평점 수정" : "평점 등록"}</button>
    {existing && <button type="button" className="w-full rounded-xl border border-red-200 py-2 text-sm text-red-700 disabled:opacity-50" disabled={mutation.isPending} onClick={remove}>평점 삭제</button>}
  </form>;
}
