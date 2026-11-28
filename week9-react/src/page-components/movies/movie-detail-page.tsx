"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { useFavorite } from "../../hooks/use-favorite";
import { useMyRatings } from "../../hooks/use-my-ratings";
import { useRatingMutations } from "../../hooks/use-rating-mutations";
import { useAuthStore } from "../../stores/auth-store";

export function MovieDetailPage() {
  const router = useRouter();

  const { movieId: movieIdParam } = useParams<{ movieId: string }>();

  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const accessToken = useAuthStore((state) => state.accessToken);

  const [editedRating, setEditedRating] = useState<number | null>(null);
  const [editedReview, setEditedReview] = useState<string | null>(null);

  // 영화 상세 정보 조회
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  // 즐겨찾기
  const {
    isBookmarked,
    isPending: isFavoritePending,
    isLoading: isFavoriteLoading,
    isError: isFavoriteError,
    toggleFavorite,
  } = useFavorite(movieId);

  // 로그인 회원의 평점 목록
  const {
    memberId,
    data: ratings = [],
    isLoading: isRatingsLoading,
    isError: isRatingsError,
  } = useMyRatings();

  // 현재 영화에 등록한 평점
  const existingRating = ratings.find((item) => item.movieId === movieId);

  const rating = editedRating ?? existingRating?.score ?? 0;
  const review = editedReview ?? existingRating?.comment ?? "";

  const {
    createMutation,
    updateMutation,
    deleteMutation,
    isPending: isRatingPending,
  } = useRatingMutations(memberId);

  const goToLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent(`/movies/${movieId}`)}`);
  };

  const handleFavoriteClick = () => {
    if (!accessToken) {
      goToLogin();
      return;
    }

    toggleFavorite();
  };

  const handleSaveRating = async () => {
    if (!accessToken) {
      goToLogin();
      return;
    }

    if (isRatingsLoading || isRatingsError || isRatingPending) {
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("별점을 1점 이상 선택해 주세요.");
      return;
    }

    if (review.length > 500) {
      alert("후기는 500자 이하로 입력해 주세요.");
      return;
    }

    try {
      if (existingRating) {
        await updateMutation.mutateAsync({
          ratingId: existingRating.ratingId,
          request: {
            score: rating,
            comment: review,
          },
        });

        alert("평점을 수정했어요.");
      } else {
        await createMutation.mutateAsync({
          movieId,
          score: rating,
          comment: review,
        });

        alert("평점을 등록했어요.");
      }

      setEditedRating(null);
      setEditedReview(null);
    } catch {
      alert("평점을 저장하지 못했어요. 다시 시도해 주세요.");
    }
  };

  const handleDeleteRating = async () => {
    if (!existingRating || isRatingPending) {
      return;
    }

    if (!window.confirm("등록한 평점을 삭제할까요?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(existingRating.ratingId);

      setEditedRating(null);
      setEditedReview(null);

      alert("평점을 삭제했어요.");
    } catch {
      alert("평점을 삭제하지 못했어요.");
    }
  };

  if (!isValidMovieId) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa]">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa] text-red-500">
        영화 정보를 불러오지 못했어요.
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  if (!movie) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const genres = movie.genres.map((genre) => genre.name).join(" · ");

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영시간 정보 없음";

  const favoriteButtonText = !accessToken
    ? "즐겨찾기"
    : isFavoriteLoading
      ? "확인 중..."
      : isFavoritePending
        ? "처리 중..."
        : isBookmarked
          ? "즐겨찾기 해제"
          : "즐겨찾기";

  return (
    <main className="min-h-[calc(100vh-86px)] bg-[#f7f8fa] text-[#191919]">
      {/* 영화 배너 */}
      <section className="relative h-[310px] overflow-hidden bg-[#191919]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative mx-auto flex h-full w-[min(1210px,calc(100%-64px))] flex-col text-white">
          <Link
            href="/"
            className="mt-[28px] w-fit text-[13px] font-semibold text-white no-underline"
          >
            ← 영화 목록
          </Link>

          <div className="mt-auto pb-[28px]">
            <h1 className="mb-[8px] text-[32px] font-bold">{movie.title}</h1>

            <p className="mb-[6px] text-[13px]">{movie.original_title}</p>

            <p className="m-0 text-[13px] font-semibold">
              {movie.release_date || "개봉일 정보 없음"}
              {" · "}
              {genres}
              {" · "}
              {runtime}
            </p>
          </div>
        </div>
      </section>

      {/* 영화 정보 */}
      <section className="mx-auto grid w-[min(1210px,calc(100%-64px))] grid-cols-[1fr_300px] gap-[32px] py-[22px]">
        <div className="flex gap-[28px]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="h-[245px] w-[165px] shrink-0 rounded-[9px] object-cover shadow-md"
            />
          ) : (
            <div className="flex h-[245px] w-[165px] shrink-0 items-center justify-center rounded-[9px] bg-[#e5e7eb] text-[13px] text-[#969ba3]">
              이미지 없음
            </div>
          )}

          <div className="flex-1">
            <h2 className="mb-[14px] text-[20px] font-bold">
              {movie.tagline || movie.title}
            </h2>

            <p className="mb-[8px] text-[13px] leading-[1.8] text-[#737780]">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>

            <button
              type="button"
              onClick={handleFavoriteClick}
              disabled={
                Boolean(accessToken) &&
                (isFavoriteLoading || isFavoritePending || isFavoriteError)
              }
              className={`mt-[14px] flex h-[42px] cursor-pointer items-center gap-2 rounded-[7px] border-0 px-[16px] text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                isBookmarked ? "bg-[#191919]" : "bg-[#2878f0]"
              }`}
            >
              <img
                src="/icons/bookmark.svg"
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
              {favoriteButtonText}
            </button>

            {accessToken && isFavoriteError && (
              <p className="mt-2 text-xs text-red-500">
                즐겨찾기 정보를 처리하지 못했어요.
              </p>
            )}
          </div>
        </div>

        {/* 내 평점 */}
        <aside className="border-l border-[#dfe2e6] pl-[26px]">
          <h2 className="mb-[6px] text-[18px] font-bold">내 평점</h2>

          <p className="mb-[10px] text-[12px] text-[#969ba3]">
            별점은 필수, 후기는 선택이에요.
          </p>

          <div className="mb-[10px] flex gap-[5px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setEditedRating(star)}
                disabled={isRatingPending}
                aria-label={`${star}점`}
                className={`flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[6px] border border-[#dfe2e6] bg-white text-[23px] disabled:opacity-50 ${
                  star <= rating ? "text-[#191919]" : "text-[#969ba3]"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={review}
            onChange={(event) => setEditedReview(event.target.value)}
            maxLength={500}
            disabled={isRatingPending}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[90px] w-full resize-none rounded-[7px] border border-[#dfe2e6] bg-white p-[12px] text-[12px] outline-none placeholder:text-[#a0a5ad]"
          />

          {accessToken && isRatingsError && (
            <p className="mt-2 text-xs text-red-500">
              평점 정보를 불러오지 못했어요.
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleSaveRating()}
            disabled={
              isRatingPending ||
              (Boolean(accessToken) && (isRatingsLoading || isRatingsError))
            }
            className="mt-[10px] h-[40px] w-full cursor-pointer rounded-[7px] border-0 bg-[#191919] text-[13px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRatingPending
              ? "처리 중..."
              : existingRating
                ? "평점 수정"
                : "평점 저장"}
          </button>

          {existingRating && (
            <button
              type="button"
              onClick={() => void handleDeleteRating()}
              disabled={isRatingPending}
              className="mt-[8px] h-[36px] w-full cursor-pointer rounded-[7px] border border-[#dfe2e6] bg-white text-[12px] font-semibold text-red-500 disabled:opacity-50"
            >
              평점 삭제
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}


