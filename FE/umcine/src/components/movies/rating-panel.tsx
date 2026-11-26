"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { RatingResponse } from "../../api/members";
import {
  useMemberRatings,
  useRatingMutation,
} from "../../hooks/use-member-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberIdFromToken } from "../../utils/auth/jwt";
import { getRequestErrorMessage } from "../../utils/auth/request-error";
import { buttonClassName, inputClassName } from "../auth/form-styles";
import RequestStatus from "./request-status";

export function RatingPanel({ movieId }: { movieId: number }) {
  const token = useAuthStore((state) => state.accessToken);
  const memberId = token ? getMemberIdFromToken(token) : null;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-bold">내 평점</h2>
        {!token ? (
          <>
            <p className="text-sm text-zinc-600">
              로그인하면 평점을 등록할 수 있어요.
            </p>
            <Link href="/login" className={`${buttonClassName} inline-flex`}>
              로그인
            </Link>
          </>
        ) : memberId ? (
          <MemberRating key={token} movieId={movieId} memberId={memberId} />
        ) : (
          <p role="alert" className="text-sm text-red-700">
            회원 번호를 확인할 수 없어요. 다시 로그인해 주세요.
          </p>
        )}
      </div>
    </section>
  );
}

function MemberRating({
  memberId,
  movieId,
}: {
  memberId: number;
  movieId: number;
}) {
  const ratings = useMemberRatings(memberId);
  if (!ratings.data) {
    return (
      <RequestStatus
        loading={ratings.isLoading}
        loadingMessage="평점을 불러오는 중이에요…"
        error={
          ratings.isError
            ? getRequestErrorMessage(ratings.error, "평점을 불러오지 못했어요.")
            : undefined
        }
        onRetry={() => void ratings.refetch()}
      />
    );
  }

  const rating = ratings.data.find((item) => item.movieId === movieId);
  return (
    <RatingForm
      key={`${movieId}:${rating?.ratingId ?? "new"}`}
      memberId={memberId}
      movieId={movieId}
      rating={rating}
    />
  );
}

function RatingForm({
  memberId,
  movieId,
  rating,
}: {
  memberId: number;
  movieId: number;
  rating?: RatingResponse;
}) {
  const [draftScore, setScore] = useState<number>();
  const [draftComment, setComment] = useState<string>();
  const score = draftScore ?? rating?.score ?? 5;
  const comment = draftComment ?? rating?.comment ?? "";
  const mutation = useRatingMutation(memberId, movieId);
  const unchanged =
    rating &&
    score === rating.score &&
    comment.trim() === (rating.comment ?? "");
  const canSave =
    Number.isInteger(score) &&
    score >= 1 &&
    score <= 5 &&
    comment.length <= 500 &&
    !unchanged &&
    !mutation.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    const input = { score, comment: comment.trim() || null };
    mutation.mutate(
      rating
        ? { action: "update", ratingId: rating.ratingId, input }
        : { action: "create", input },
      {
        onSuccess: () => {
          setScore(undefined);
          setComment(undefined);
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-busy={mutation.isPending}
    >
      {rating && (
        <p className="text-sm text-zinc-600">저장된 평점 {rating.score}/5</p>
      )}
      <fieldset disabled={mutation.isPending} className="space-y-4">
        <div>
          <label
            htmlFor="rating-score"
            className="mb-2 block text-sm font-bold"
          >
            평점
          </label>
          <select
            id="rating-score"
            className={inputClassName}
            value={score}
            onChange={(event) => setScore(Number(event.target.value))}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}점
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="rating-comment"
            className="mb-2 block text-sm font-bold"
          >
            한 줄 평
          </label>
          <textarea
            id="rating-comment"
            className={inputClassName}
            maxLength={500}
            rows={3}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonClassName} disabled={!canSave}>
            {mutation.isPending
              ? "처리 중"
              : rating
                ? "평점 수정"
                : "평점 등록"}
          </button>
          {rating && (
            <button
              type="button"
              className="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-red-700"
              onClick={() => {
                if (!mutation.isPending)
                  mutation.mutate({
                    action: "delete",
                    ratingId: rating.ratingId,
                  });
              }}
            >
              삭제
            </button>
          )}
        </div>
      </fieldset>
      {mutation.isError && (
        <p role="alert" className="text-sm text-red-700">
          {getRequestErrorMessage(mutation.error, "평점을 변경하지 못했어요.")}
        </p>
      )}
    </form>
  );
}
