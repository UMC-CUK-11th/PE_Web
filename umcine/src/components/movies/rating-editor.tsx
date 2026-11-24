import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/auth-store";
import { getTokenMemberId } from "../../utils/auth-member-id";
import { createRating, updateRating, deleteRating, getMemberRatings, type RatingInfo } from "../../api/ratings/ratings";

export function RatingEditor({ movieId }: { movieId: number }) {
  const token = useAuthStore((s) => s.accessToken);
  const memberId = getTokenMemberId(token);
  const ratings = useQuery({
    queryKey: ["ratings", "member", memberId, token],
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(token && memberId), retry: false,
  });
  if (!token) return <p><Link href="/login">로그인 후 평점을 남길 수 있어요.</Link></p>;
  if (!memberId) return <p>로그인 정보를 확인할 수 없어요. 다시 로그인해 주세요.</p>;
  if (ratings.isLoading) return <p>평점을 불러오는 중이에요.</p>;
  if (ratings.isError || !ratings.data) return <p role="alert">평점을 불러오지 못했어요.</p>;
  const existing = ratings.data.find((item) => item.movieId === movieId);
  return <RatingForm key={`${token}:${existing?.ratingId ?? "new"}`} movieId={movieId}
    memberId={memberId} token={token} existing={existing} />;
}

function RatingForm({ movieId, memberId, token, existing }: {
  movieId: number; memberId: number; token: string; existing?: RatingInfo;
}) {
  const client = useQueryClient();
  const [score, setScore] = useState(existing?.score ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [notice, setNotice] = useState("");
  const key = ["ratings", "member", memberId, token];
  const save = useMutation({
    mutationFn: () => existing
      ? updateRating(existing.ratingId, { score, comment })
      : createRating({ movieId, score, comment }),
    onSuccess: (result) => {
      client.setQueryData<RatingInfo[]>(key, (previous = []) =>
        [result, ...previous.filter((item) => item.ratingId !== result.ratingId)]);
      setNotice("평점을 저장했어요.");
    },
    onError: () => setNotice("평점 저장에 실패했어요. 로그인 상태와 입력값을 확인해 주세요."),
  });
  const remove = useMutation({
    mutationFn: () => deleteRating(existing!.ratingId),
    onSuccess: () => {
      client.setQueryData<RatingInfo[]>(key, (previous = []) => previous.filter((item) => item.ratingId !== existing!.ratingId));
    },
    onError: () => setNotice("평점 삭제에 실패했어요."),
  });
  const busy = save.isPending || remove.isPending;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || score < 1 || score > 5 || comment.length > 500) return;
    save.mutate();
  }
  return <form className="mt-4" onSubmit={submit}>
    <fieldset disabled={busy}>
      <legend className="sr-only">별점</legend>
      <div className="flex gap-2">{[1, 2, 3, 4, 5].map((value) =>
        <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value}
          onClick={() => setScore(value)}>
          <img className="h-6 w-6" src={value <= score ? "/movie-icons/star.svg" : "/movie-icons/star-outline.svg"} alt="" />
        </button>)}</div>
      <textarea className="mt-4 h-[100px] w-full rounded-lg border border-gray-300 bg-white p-3"
        aria-label="한줄평" placeholder="감상을 남겨보세요." maxLength={500}
        value={comment} onChange={(event) => setComment(event.target.value)} />
      <button className="mt-3 h-10 w-full rounded-lg bg-[#17191e] text-white disabled:opacity-50"
        type="submit" disabled={busy || !score}>{save.isPending ? "저장 중" : existing ? "평점 수정" : "평점 등록"}</button>
      {existing && <button className="mt-3 text-red-600" type="button" disabled={busy}
        onClick={() => { if (confirm("평점을 삭제할까요?")) remove.mutate(); }}>평점 삭제</button>}
    </fieldset>
    <p className="mt-2 text-sm" role="status">{notice}</p>
  </form>;
}
