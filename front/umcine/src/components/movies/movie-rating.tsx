"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import {
  createRating, deleteRating, getMemberRatings, memberRatingsKey, updateRating, type Rating,
} from "../../api/ratings/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { getMemberId } from "../../utils/get-member-id";

function RatingForm({ movieId, memberId, rating }: { movieId: number; memberId: number; rating?: Rating }) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const queryClient = useQueryClient();
  const queryKey = memberRatingsKey(memberId);
  const save = useMutation({
    mutationFn: () => rating
      ? updateRating(rating.ratingId, { score, comment })
      : createRating(movieId, { score, comment }),
    onMutate: () => useAuthStore.getState().accessToken,
    onSuccess: async (response, _variables, token) => {
      if (!token || useAuthStore.getState().accessToken !== token) return;
      await queryClient.cancelQueries({ queryKey, exact: true });
      if (useAuthStore.getState().accessToken !== token) return;
      queryClient.setQueryData<Rating[]>(queryKey, (old = []) => [response, ...old.filter((item) => item.movieId !== movieId)]);
    },
    onError: (error) => {
      if (isHTTPError(error) && [403, 404, 409].includes(error.response.status)) {
        void queryClient.invalidateQueries({ queryKey });
      }
    },
  });
  const remove = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onMutate: () => useAuthStore.getState().accessToken,
    onSuccess: async (_response, ratingId, token) => {
      if (!token || useAuthStore.getState().accessToken !== token) return;
      await queryClient.cancelQueries({ queryKey, exact: true });
      if (useAuthStore.getState().accessToken !== token) return;
      queryClient.setQueryData<Rating[]>(queryKey, (old = []) => old.filter((item) => item.ratingId !== ratingId));
    },
    onError: (error) => {
      if (isHTTPError(error) && [403, 404].includes(error.response.status)) {
        void queryClient.invalidateQueries({ queryKey });
      }
    },
  });
  const isPending = save.isPending || remove.isPending;
  const isValid = Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500;
  const error = save.error ?? remove.error;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValid && !isPending) save.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-[10px] text-[#7e8590]">이 영화는 어떠셨나요?</p>
      <fieldset className="my-2 flex gap-[5px]" disabled={isPending}>
        <legend className="sr-only">별점</legend>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="cursor-pointer">
            <input
              className="peer sr-only"
              type="radio"
              name="score"
              value={star}
              checked={score === star}
              onChange={() => { setScore(star); save.reset(); remove.reset(); }}
            />
            <Image width={18} height={18} className="opacity-80 peer-focus-visible:outline-2 peer-focus-visible:outline-[#2865e7]" src={star <= score ? "/icons/star.svg" : "/icons/star-outline.svg"} alt="" />
            <span className="sr-only">{star}점</span>
          </label>
        ))}
      </fieldset>
      <textarea
        className="min-h-[60px] w-full resize-y rounded-[3px] border border-[#e0e3e8] bg-white p-[9px] text-[10px] text-[#3d4350] outline-[#2865e7]"
        aria-label="한줄평"
        placeholder="영화에 대한 한줄평을 남겨보세요."
        maxLength={500}
        value={comment}
        disabled={isPending}
        onChange={(event) => { setComment(event.target.value); save.reset(); remove.reset(); }}
      />
      <button className="mt-2.5 h-[30px] w-full cursor-pointer rounded-[3px] bg-[#20242b] text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50" type="submit" disabled={!isValid || isPending}>
        {save.isPending ? "저장 중" : rating ? "평점 수정" : "평점 저장"}
      </button>
      {rating && (
        <button className="mt-2 h-[30px] w-full rounded-[3px] border border-red-300 text-[10px] font-bold text-red-700 disabled:opacity-50" type="button" disabled={isPending} onClick={() => remove.mutate(rating.ratingId)}>
          {remove.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      )}
      {save.isSuccess && <p role="status" className="mt-2 text-[10px] text-emerald-700">평점을 저장했어요.</p>}
      {error && <p role="alert" className="mt-2 text-[10px] text-red-700">{getApiErrorMessage(error, "평점을 처리하지 못했어요. 다시 시도해 주세요.")}</p>}
    </form>
  );
}

export function MovieRating({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const ratings = useQuery({
    queryKey: memberRatingsKey(memberId),
    queryFn: ({ signal }) => getMemberRatings(memberId!, signal),
    enabled: Boolean(accessToken) && memberId !== null,
    retry: false,
  });
  const rating = ratings.data?.find((item) => item.movieId === movieId);

  return (
    <aside className="pt-2 md:pt-[2px] md:pl-2" aria-label="내 평점">
      <h2 className="mb-2 text-[15px] font-extrabold tracking-[-0.6px] text-[#252a34]">내 평점</h2>
      {!accessToken || memberId === null ? (
        <p className="text-[11px] text-[#667080]">평점을 남기려면 <Link className="text-[#2865e7]" href="/login">로그인</Link>해 주세요.</p>
      ) : ratings.isPending ? (
        <p role="status" className="text-[11px] text-[#667080]">내 평점을 불러오는 중이에요.</p>
      ) : ratings.isError ? (
        <div className="text-[11px] text-[#667080]">
          <p role="alert">{getApiErrorMessage(ratings.error, "내 평점을 불러오지 못했어요.")}</p>
          <button className="mt-2 text-[#2865e7]" type="button" onClick={() => void ratings.refetch()}>다시 시도</button>
        </div>
      ) : (
        <RatingForm key={`${movieId}-${rating?.ratingId ?? "new"}`} movieId={movieId} memberId={memberId} rating={rating} />
      )}
    </aside>
  );
}
