import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../../api/ratings/create-rating";
import { updateRating } from "../../api/ratings/update-rating";
import { deleteRating } from "../../api/ratings/delete-rating";
import { getMemberRatings } from "../../api/ratings/get-member-ratings";
import type { Rating } from "../../api/ratings/models";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import "./movie-rating.css";

export function MovieRating({ movieId }: { movieId: number }) {
  const session = useAuthStore((state) => state.session);
  const sessionMessage = useAuthStore((state) => state.sessionMessage);
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState("");
  const queryKey = ["ratings", "member", session?.memberId] as const;
  const ratingsQuery = useQuery({
    queryKey,
    queryFn: () => getMemberRatings(session!.memberId),
    enabled: !!session,
    retry: false,
    staleTime: 0,
  });
  const rating = ratingsQuery.data?.find((item) => item.movieId === movieId);

  function handleSaved(saved: Rating) {
    queryClient.setQueryData<Rating[]>(queryKey, (previous = []) => [
      saved, ...previous.filter((item) => item.movieId !== movieId),
    ]);
    setNotice(rating ? "평점을 수정했어요." : "평점을 등록했어요.");
  }

  function handleDeleted() {
    queryClient.setQueryData<Rating[]>(queryKey, (previous = []) =>
      previous.filter((item) => item.movieId !== movieId));
    setNotice("평점을 삭제했어요.");
  }

  return (
    <div className="movie-rating">
      <h2>내 평점</h2>
      {!session ? (
        <>
          <p>{sessionMessage ?? "로그인 후 평점을 남길 수 있어요."}</p>
          <Link to="/login" className="rating-login-link">로그인하기</Link>
        </>
      ) : ratingsQuery.isPending ? (
        <p role="status">내 평점을 불러오는 중이에요.</p>
      ) : ratingsQuery.isError ? (
        <>
          <p role="alert" className="rating-error">{getApiErrorMessage(ratingsQuery.error, "내 평점을 불러오지 못했어요.")}</p>
          <button type="button" onClick={() => ratingsQuery.refetch()}>다시 불러오기</button>
        </>
      ) : (
        <>
          {notice && <p role="status" className="rating-notice">{notice}</p>}
          <RatingForm
            key={`${session.memberId}:${movieId}:${rating?.ratingId ?? "new"}:${rating?.updatedAt ?? ""}`}
            movieId={movieId} rating={rating}
            onSaved={handleSaved} onDeleted={handleDeleted}
          />
        </>
      )}
    </div>
  );
}

interface RatingFormProps {
  movieId: number;
  rating?: Rating;
  onSaved: (rating: Rating) => void;
  onDeleted: () => void;
}

function RatingForm({ movieId, rating, onSaved, onDeleted }: RatingFormProps) {
  const [score, setScore] = useState(rating?.score ?? 0);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const saveMutation = useMutation({
    mutationFn: () => rating
      ? updateRating(rating.ratingId, { score, comment: comment.trim() })
      : createRating({ movieId, score, comment: comment.trim() }),
    onSuccess: (response) => onSaved(response.result),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteRating(rating!.ratingId),
    onSuccess: onDeleted,
  });
  const isPending = saveMutation.isPending || deleteMutation.isPending;
  const canSubmit = Number.isInteger(score) && score >= 1 && score <= 5 && comment.length <= 500;
  const error = saveMutation.error ?? deleteMutation.error;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending || !canSubmit) return;
    deleteMutation.reset();
    saveMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>별점은 필수, 후기는 선택이에요.</p>
      {rating && <p className="rating-saved">저장된 내 평점: {rating.score}점</p>}
      <div id="star-list" role="group" aria-label="별점" className="rating-stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" aria-label={`${value}점`} aria-pressed={score === value}
            className={value <= score ? "is-selected" : ""} disabled={isPending}
            onClick={() => setScore(value)}>★</button>
        ))}
      </div>
      <p className="rating-score" aria-live="polite">{score ? `${score}점 선택` : "별점을 선택해 주세요."}</p>
      <label htmlFor="rating-comment" className="rating-comment-label">후기</label>
      <textarea id="rating-comment" value={comment} onChange={(event) => setComment(event.target.value)}
        placeholder="영화를 보고 느낀 점을 남겨보세요." maxLength={500} disabled={isPending}
        aria-describedby="rating-comment-count" />
      <p id="rating-comment-count" className="rating-count">{comment.length}/500자</p>
      {error && <p role="alert" className="rating-error">{getApiErrorMessage(error, "평점을 저장하지 못했어요. 서버 연결을 확인하고 다시 시도해 주세요.")}</p>}
      <button id="rating-save-button" className="rating-save" type="submit" disabled={!canSubmit || isPending}>
        {saveMutation.isPending ? "저장 중" : rating ? "평점 수정" : "평점 저장"}
      </button>
      {rating && <button className="rating-delete" type="button" disabled={isPending} onClick={() => {
        if (isPending) return;
        saveMutation.reset();
        deleteMutation.mutate();
      }}>{deleteMutation.isPending ? "삭제 중" : "평점 삭제"}</button>}
    </form>
  );
}
