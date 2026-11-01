import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { bookmarkedMovieIds, toggleBookmark } = useBookmarkStore();

  useEffect(() => {
    let ignore = false;

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovieDetail(Number(movieId));
        

        if (!ignore) {
          setMovie(response);
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

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <p className="text-gray-500">영화 정보를 불러오는 중...</p>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {errorMessage ?? "영화를 찾을 수 없어요."}
          </h1>

          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            ← 영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.png";

  return (
    <main className="min-h-screen bg-white">
      {/* 배경 이미지 */}
      <section className="relative h-[430px] overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        )}

        {/* 배경 어둡게 */}
        <div className="absolute inset-0 bg-black/55" />

        {/* 영화 기본 정보 */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto flex w-full max-w-7xl items-end gap-8 px-6 pb-10">
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="w-44 rounded-xl shadow-xl md:w-52"
            />

            <div className="pb-2 text-white">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold md:text-4xl">
                  {movie.title}
                </h1>

                <button
                  type="button"
                  onClick={() => toggleBookmark(movie.id)}
                  className="text-3xl"
                  aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
                >
                  {isBookmarked ? "★" : "☆"}
                </button>
              </div>

              <p className="mt-2 text-base text-gray-300">
                {movie.original_title}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-200">
                <span>{movie.release_date}</span>
                <span>·</span>
                <span>{movie.genres.map((genre) => genre.name).join(" · ")}</span>
                <span>·</span>
                <span>{movie.runtime ? `${movie.runtime}분` : "상영시간 정보 없음"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상세 내용 */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-semibold text-gray-500 transition hover:text-gray-900"
        >
          ← 영화 목록
        </Link>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {movie.tagline}
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600">
            {movie.overview}
          </p>
        </div>
      </section>
    </main>
  );
}