import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { Rating, RatingForm } from "../../api/ratings";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useMyRatingQuery,
  useUpdateRatingMutation,
} from "../../hooks/use-my-rating";
import { useAuthStore } from "../../stores/auth-store";
import { buttonClass, inputClass, linkClass } from "../member-form";

// 영화 상세의 "내 평점" 영역
export function RatingSection({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <section className="mt-10 max-w-3xl rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold">내 평점</h2>
      {accessToken ? (
        <MyRating movieId={movieId} />
      ) : (
        <p className="text-sm text-gray-600">
          <Link to="/login" className={linkClass}>로그인</Link>하면 평점을 남길 수 있어요.
        </p>
      )}
    </section>
  );
}

function MyRating({ movieId }: { movieId: number }) {
  const ratingQuery = useMyRatingQuery(movieId);
  const createMutation = useCreateRatingMutation(movieId);
  const updateMutation = useUpdateRatingMutation();
  const deleteMutation = useDeleteRatingMutation();
  const [isEditing, setIsEditing] = useState(false);

  if (ratingQuery.isPending) return <p className="text-sm text-gray-500">평점을 불러오는 중이에요.</p>;
  if (ratingQuery.isError) return <p role="alert" className="text-sm text-red-600">평점을 불러오지 못했어요.</p>;

  const rating = ratingQuery.data;

  // 아직 평점이 없으면 등록 폼
  if (!rating) {
    return (
      <RatingFormView
        submitLabel="등록"
        isPending={createMutation.isPending}
        onSubmit={(form) => createMutation.mutate(form)}
      />
    );
  }

  // 수정 중이면 기존 값을 채운 수정 폼
  if (isEditing) {
    return (
      <RatingFormView
        initial={rating}
        submitLabel="저장"
        isPending={updateMutation.isPending}
        onSubmit={(form) =>
          updateMutation.mutate({ ratingId: rating.ratingId, form }, { onSuccess: () => setIsEditing(false) })
        }
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // 평점이 있으면 내용 + 수정/삭제 버튼
  return (
    <div>
      <p className="text-lg font-semibold">{"★".repeat(rating.score)}{"☆".repeat(5 - rating.score)} ({rating.score}점)</p>
      {rating.comment && <p className="mt-2 whitespace-pre-wrap text-gray-700">{rating.comment}</p>}
      <div className="mt-4 flex gap-3">
        <button type="button" className={buttonClass} onClick={() => setIsEditing(true)}>수정</button>
        <button
          type="button"
          className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 disabled:opacity-40"
          disabled={deleteMutation.isPending}
          onClick={() => {
            if (confirm("평점을 삭제할까요?")) deleteMutation.mutate(rating.ratingId);
          }}
        >
          {deleteMutation.isPending ? "삭제 중" : "삭제"}
        </button>
      </div>
    </div>
  );
}

interface RatingFormViewProps {
  initial?: Rating;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (form: RatingForm) => void;
  onCancel?: () => void;
}

// 등록과 수정이 같이 쓰는 입력 폼 (별점 1~5, 코멘트 최대 500자)
function RatingFormView({ initial, submitLabel, isPending, onSubmit, onCancel }: RatingFormViewProps) {
  const [score, setScore] = useState(initial?.score ?? 5);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const canSubmit = score >= 1 && score <= 5 && comment.length <= 500 && !isPending;

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit({ score, comment: comment.trim() });
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="rating-score" className="mb-2 block text-sm font-semibold">별점</label>
        <select id="rating-score" className={inputClass} value={score} onChange={(event) => setScore(Number(event.target.value))}>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{"★".repeat(value)} ({value}점)</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="rating-comment" className="mb-2 block text-sm font-semibold">코멘트 (선택)</label>
        <textarea id="rating-comment" className={inputClass} rows={3} maxLength={500} value={comment}
          onChange={(event) => setComment(event.target.value)} />
        <p className="mt-1 text-right text-xs text-gray-500">{comment.length}/500</p>
      </div>
      <div className="flex gap-3">
        <button type="submit" className={buttonClass} disabled={!canSubmit}>{isPending ? "처리 중" : submitLabel}</button>
        {onCancel && <button type="button" className={linkClass} onClick={onCancel}>취소</button>}
      </div>
    </form>
  );
}
