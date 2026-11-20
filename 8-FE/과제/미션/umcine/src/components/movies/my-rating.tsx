import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import type { Rating } from "../../api/ratings/ratings";
import { useMemberRatingsQuery, useRatingMutations } from "../../hooks/use-my-ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { getMemberIdFromToken } from "../../utils/get-member-id-from-token";

const SCORES = [5, 4, 3, 2, 1];
const MAX_COMMENT = 500;

export function MyRating({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberIdFromToken(accessToken);

  return (
    <section aria-labelledby="my-rating" className="mt-10 rounded-lg border border-white/15 bg-slate-900/60 p-5">
      <h2 id="my-rating" className="text-lg font-semibold">
        내 평점
      </h2>
      {memberId === null ? (
        <p className="mt-3 text-sm text-slate-300">
          <Link to="/login" className="font-semibold text-white underline">
            로그인
          </Link>
          하면 이 영화에 평점을 남길 수 있어요.
        </p>
      ) : (
        <MyRatingBody memberId={memberId} movieId={movieId} />
      )}
    </section>
  );
}

function MyRatingBody({ memberId, movieId }: { memberId: number; movieId: number }) {
  const ratingsQuery = useMemberRatingsQuery(memberId);
  const { create, update, remove } = useRatingMutations(memberId);
  const [isEditing, setIsEditing] = useState(false);

  if (ratingsQuery.isPending) return <p className="mt-3 text-sm text-slate-300">내 평점을 불러오는 중이에요.</p>;
  if (ratingsQuery.isError) return <p role="alert" className="mt-3 text-sm text-red-300">내 평점을 불러오지 못했어요.</p>;

  const rating = ratingsQuery.data.find((item) => item.movieId === movieId);

  if (!rating || isEditing) {
    const mutation = rating ? update : create;
    return (
      <RatingForm
        key={rating?.ratingId ?? "new"}
        initial={rating}
        isPending={mutation.isPending}
        errorMessage={mutation.isError ? getApiErrorMessage(mutation.error, "평점을 저장하지 못했어요. 다시 시도해 주세요.") : null}
        onCancel={rating ? () => setIsEditing(false) : undefined}
        onSubmit={(input) =>
          rating
            ? update.mutate({ ratingId: rating.ratingId, ...input }, { onSuccess: () => setIsEditing(false) })
            : create.mutate({ movieId, ...input })
        }
      />
    );
  }

  return (
    <div className="mt-3">
      <p className="text-2xl font-bold text-yellow-400" aria-label={`별점 ${rating.score}점`}>
        {"★".repeat(rating.score)}
        <span className="text-slate-500">{"★".repeat(5 - rating.score)}</span>
      </p>
      {rating.comment && <p className="mt-2 text-sm leading-6 text-slate-200">{rating.comment}</p>}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => {
            update.reset();
            setIsEditing(true);
          }}
          className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900"
        >
          평점 수정
        </button>
        <button
          type="button"
          disabled={remove.isPending}
          onClick={() => remove.mutate(rating.ratingId)}
          className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold disabled:cursor-wait disabled:opacity-60"
        >
          {remove.isPending ? "삭제 중" : "평점 삭제"}
        </button>
      </div>
      {remove.isError && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {getApiErrorMessage(remove.error, "평점을 삭제하지 못했어요. 다시 시도해 주세요.")}
        </p>
      )}
    </div>
  );
}

interface RatingFormProps {
  initial?: Rating;
  isPending: boolean;
  errorMessage: string | null;
  onCancel?: () => void;
  onSubmit: (input: { score: number; comment: string }) => void;
}

function RatingForm({ initial, isPending, errorMessage, onCancel, onSubmit }: RatingFormProps) {
  const [score, setScore] = useState(initial?.score ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const canSubmit = score >= 1 && score <= 5 && comment.length <= MAX_COMMENT && !isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({ score, comment: comment.trim() });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-3 flex flex-col gap-3">
      <fieldset>
        <legend className="mb-2 text-sm text-slate-300">별점</legend>
        <div className="flex gap-1">
          {SCORES.slice().reverse().map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value}점`}
              aria-pressed={score === value}
              onClick={() => setScore(value)}
              className={value <= score ? "text-3xl text-yellow-400" : "text-3xl text-slate-500"}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label className="flex flex-col gap-2 text-sm text-slate-300">
        한 줄 후기 (선택)
        <textarea
          value={comment}
          maxLength={MAX_COMMENT}
          rows={3}
          onChange={(event) => setComment(event.target.value)}
          className="rounded-md border border-white/20 bg-slate-950/60 p-3 text-white outline-none focus:border-white/60"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-[#235ce8] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "저장 중" : initial ? "수정 완료" : "평점 남기기"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-md border border-white/40 px-4 py-2 text-sm font-semibold">
            취소
          </button>
        )}
      </div>
      {errorMessage && (
        <p role="alert" className="text-sm text-red-300">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
