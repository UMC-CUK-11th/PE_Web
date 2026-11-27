"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HTTPError } from "ky";
import { adaptTmdbMovieDetails } from "../api/tmdb-adapter";
import { movieDetailsQueryOptions } from "../api/movie-query-options";
import {
  createRatingMutationOptions,
  deleteRatingMutationOptions,
  memberRatingsQueryOptions,
  ratingQueryKeys,
  updateRatingMutationOptions,
} from "../api/rating-query-options";
import { BookmarkButton } from "../components/bookmark-button";
import { ErrorState, LoadingState } from "../components/request-state";
import { useAuthStore } from "../stores/auth-store";
import { getApiErrorMessage } from "../utils/api-error";
import { cn } from "../utils/cn";

function MovieNotFound() {
  return (
    <main className="grid flex-1 place-items-center px-6 text-center">
      <div>
        <span className="text-sm font-bold text-[#2877eb]">404</span>
        <h1 className="mt-3 text-[32px] font-extrabold">영화를 찾을 수 없어요.</h1>
        <p className="mt-3 text-sm text-[#7f8792]">주소를 다시 확인하거나 영화 목록으로 돌아가 주세요.</p>
        <Link className="mt-8 inline-flex rounded-lg bg-[#2877eb] px-5 py-3 text-sm font-bold text-white no-underline" href="/">영화 목록으로</Link>
      </div>
    </main>
  );
}

interface MovieDetailPageProps {
  movieId: string;
}

export function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const memberId = useAuthStore((state) => state.memberId);
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const [ratingDraft, setRatingDraft] = useState<{ score: number; comment: string } | null>(null);
  const [ratingMessage, setRatingMessage] = useState("");
  const movieQuery = useQuery(movieDetailsQueryOptions(parsedMovieId, isValidMovieId));
  const ratingsQuery = useQuery(memberRatingsQueryOptions(memberId ?? 0, isLoggedIn && memberId !== null));
  const existingRating = ratingsQuery.data?.find((item) => item.movieId === parsedMovieId);
  const rating = ratingDraft?.score ?? existingRating?.score ?? 0;
  const review = ratingDraft?.comment ?? existingRating?.comment ?? "";

  const refreshRatings = async () => {
    if (memberId !== null) {
      await queryClient.invalidateQueries({ queryKey: ratingQueryKeys.member(memberId) });
    }
  };

  const createMutation = useMutation({
    ...createRatingMutationOptions(),
    onSuccess: async () => {
      setRatingDraft(null);
      setRatingMessage("평점을 등록했어요.");
      await refreshRatings();
    },
    onError: async (error) => setRatingMessage(await getApiErrorMessage(error, "평점 등록에 실패했어요.")),
  });
  const updateMutation = useMutation({
    ...updateRatingMutationOptions(),
    onSuccess: async () => {
      setRatingDraft(null);
      setRatingMessage("평점을 수정했어요.");
      await refreshRatings();
    },
    onError: async (error) => setRatingMessage(await getApiErrorMessage(error, "평점 수정에 실패했어요.")),
  });
  const deleteMutation = useMutation({
    ...deleteRatingMutationOptions(),
    onSuccess: async () => {
      setRatingDraft({ score: 0, comment: "" });
      setRatingMessage("평점을 삭제했어요.");
      await refreshRatings();
    },
    onError: async (error) => setRatingMessage(await getApiErrorMessage(error, "평점 삭제에 실패했어요.")),
  });
  const isRatingPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSaveRating = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (rating === 0) {
      setRatingMessage("별점을 먼저 선택해 주세요.");
      return;
    }

    setRatingMessage("");
    if (existingRating) {
      updateMutation.mutate({ ratingId: existingRating.ratingId, score: rating, comment: review.trim() });
    } else {
      createMutation.mutate({ movieId: parsedMovieId, score: rating, comment: review.trim() });
    }
  };

  if (!isValidMovieId) return <MovieNotFound />;
  if (movieQuery.isPending) {
    return <main className="flex-1"><LoadingState message="영화 상세 정보를 불러오는 중이에요." /></main>;
  }
  if (movieQuery.isError) {
    if (movieQuery.error instanceof HTTPError && movieQuery.error.response.status === 404) {
      return <MovieNotFound />;
    }
    return <main className="flex-1"><ErrorState error={movieQuery.error} onRetry={() => void movieQuery.refetch()} /></main>;
  }

  const movie = adaptTmdbMovieDetails(movieQuery.data);

  return (
    <main className="flex-1">
      <section className="relative h-[370px] overflow-hidden text-white" aria-labelledby="movie-title">
        <img className="absolute inset-0 size-full object-cover" src={movie.backdropPath} alt="" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,12,.86)_0%,rgba(6,8,12,.42)_46%,rgba(6,8,12,.08)_100%),linear-gradient(0deg,rgba(6,8,12,.72)_0%,transparent_55%)]" />
        <div className="relative mx-auto flex h-full w-[min(calc(100%-48px),1200px)] flex-col py-7 max-[420px]:w-[calc(100%-32px)]">
          <Link className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white no-underline" href="/">
            <span aria-hidden="true">‹</span>
            영화 목록
          </Link>
          <div className="mt-auto pb-5">
            <h1 className="text-[42px] font-extrabold tracking-[-2px] drop-shadow-lg max-sm:text-[32px]" id="movie-title">{movie.title}</h1>
            <p className="mt-2 text-sm text-white/85">{movie.originalTitle}</p>
            <p className="mt-3 flex flex-wrap gap-x-3 text-sm font-semibold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-[min(calc(100%-48px),1200px)] grid-cols-[200px_minmax(0,1fr)_350px] gap-8 py-6 pb-24 max-[900px]:grid-cols-[170px_minmax(0,1fr)] max-sm:grid-cols-1 max-[420px]:w-[calc(100%-32px)]">
        <img className="w-full rounded-lg object-cover shadow-[0_12px_28px_rgba(15,20,28,.15)] max-sm:w-[180px]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <div className="pt-1">
          <h2 className="text-xl font-extrabold">{movie.tagline}</h2>
          <p className="mt-4 text-sm leading-7 text-[#676f79]">{movie.overview}</p>
          <BookmarkButton className="mt-6" movieId={movie.id} movieTitle={movie.title} useDetailStatus />
        </div>

        <aside className="border-l border-[#dfe3e8] pl-8 max-[900px]:col-span-2 max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pt-6 max-[900px]:pl-0 max-sm:col-span-1">
          <h2 className="text-xl font-extrabold">내 평점</h2>
          <p className="mt-2 text-xs text-[#8c939c]">별점을 클릭하고, 후기를 작성하세요.</p>
          <div className="mt-3 flex gap-2" aria-label="평점 선택">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                className={cn(
                  "grid size-9 cursor-pointer place-items-center rounded-md border text-xl",
                  score <= rating
                    ? "border-[#2877eb] bg-[#2877eb] text-white"
                    : "border-[#dfe3e8] bg-white text-[#8a929d]",
                )}
                type="button"
                key={score}
                aria-label={`${score}점`}
                aria-pressed={score === rating}
                disabled={isRatingPending}
                onClick={() => {
                  setRatingDraft({ score, comment: review });
                  setRatingMessage("");
                }}
              >
                ★
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="movie-review">영화 후기</label>
          <textarea
            className="mt-4 h-24 w-full resize-none rounded-lg border border-[#dfe3e8] bg-white p-4 text-sm outline-none focus:border-[#2877eb]"
            id="movie-review"
            value={review}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            onChange={(event) => setRatingDraft({ score: rating, comment: event.target.value })}
            disabled={isRatingPending}
          />
          {ratingMessage && <p className="mt-2 text-xs text-[#2877eb]" role="status">{ratingMessage}</p>}
          <div className="mt-3 flex gap-2">
            {existingRating && (
              <button
                className="h-10 flex-1 cursor-pointer rounded-md border border-[#dfe3e8] bg-white text-sm font-bold text-[#5c646e] disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={isRatingPending}
                onClick={() => deleteMutation.mutate(existingRating.ratingId)}
              >
                삭제
              </button>
            )}
            <button
              className="h-10 flex-1 cursor-pointer rounded-md border-0 bg-[#18191b] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              disabled={isRatingPending}
              onClick={handleSaveRating}
            >
              {isRatingPending ? "저장 중" : existingRating ? "평점 수정" : "평점 저장"}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
