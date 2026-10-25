import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/movies/tmdb-image";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMovieDetail() {
      try {
        const response = await getMovieDetail(Number(movieId));

        if (!ignore) {
          setMovie(response);
          setErrorMessage(null);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 정보를 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa]">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa] text-red-500">
        {errorMessage}
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="flex min-h-[500px] items-center justify-center bg-[#f7f8fa]">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const genres = movie.genres.map((genre) => genre.name).join(" · ");

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영시간 정보 없음";

  return (
    <main className="min-h-[calc(100vh-86px)] bg-[#f7f8fa] text-[#191919]">
      {/* 상단 영화 배너 */}
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
            to="/"
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
              onClick={() => toggleBookmark(movie.id)}
              className={`mt-[14px] flex h-[42px] cursor-pointer items-center gap-2 rounded-[7px] border-0 px-[16px] text-[13px] font-bold text-white ${
                isBookmarked ? "bg-[#191919]" : "bg-[#2878f0]"
              }`}
            >
              <img
                src="/icons/bookmark.svg"
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
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
                onClick={() => setRating(star)}
                aria-label={`${star}점`}
                className={`flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[6px] border border-[#dfe2e6] bg-white text-[23px] ${
                  star <= rating ? "text-[#191919]" : "text-[#969ba3]"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[90px] w-full resize-none rounded-[7px] border border-[#dfe2e6] bg-white p-[12px] text-[12px] outline-none placeholder:text-[#a0a5ad]"
          />

          <button
            type="button"
            className="mt-[10px] h-[40px] w-full cursor-pointer rounded-[7px] border-0 bg-[#191919] text-[13px] font-bold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
