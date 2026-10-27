import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { SiteFooter } from "../../components/layout/site-footer";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isInteger(parsedMovieId) || parsedMovieId <= 0) return;

    let ignore = false;

    async function loadMovie() {
      setIsLoading(true);
      setErrorMessage(null);
      setMovie(null);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [parsedMovieId]);

  if (!isValidMovieId || isLoading || errorMessage || !movie || movie.id !== parsedMovieId) {
    const message = !isValidMovieId
      ? "올바르지 않은 영화 번호예요."
      : isLoading || (movie && movie.id !== parsedMovieId)
        ? "영화 정보를 불러오는 중이에요."
        : errorMessage ?? "영화 정보를 불러오지 못했어요.";

    return (
      <>
        <main className="mx-auto flex min-h-[calc(100vh-132px)] max-w-5xl flex-col items-center justify-center px-10 text-center">
          <p className="text-xl font-bold text-[#202228]" role={isLoading ? "status" : "alert"}>
            {message}
          </p>
          <Link
            className="mt-5 rounded-lg bg-[#2669ee] px-5 py-3 text-sm font-bold text-white no-underline"
            to="/"
          >
            영화 목록으로 돌아가기
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtime = movie.runtime === null
    ? "상영 시간 정보가 없어요."
    : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;

  return (
    <>
      <main className="relative min-h-[calc(100vh-132px)] overflow-hidden bg-[#111318] text-white">
        {backdropUrl ? (
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src={backdropUrl}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2b2e35] text-sm text-white/60">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,17,0.96)_0%,rgba(10,12,17,0.82)_45%,rgba(10,12,17,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#111318_0%,transparent_45%)]" />

        <div className="relative mx-auto w-[min(calc(100%-80px),1200px)] py-12">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 no-underline hover:text-white"
            to="/"
          >
            <img
              className="size-5 invert"
              src="/icons/chevron-left.svg"
              alt=""
            />
            영화 목록
          </Link>

          <section className="mt-10 grid grid-cols-[280px_1fr] items-center gap-14">
            {posterUrl ? (
              <img
                className="aspect-[2/2.82] w-[280px] rounded-xl object-cover shadow-2xl"
                src={posterUrl}
                alt={`${movie.title} 포스터`}
              />
            ) : (
              <div className="flex aspect-[2/2.82] w-[280px] items-center justify-center rounded-xl bg-[#2b2e35] text-sm text-white/60">
                이미지 없음
              </div>
            )}
            <div className="max-w-[700px]">
              <p className="text-base text-white/65">{movie.original_title}</p>
              <h1 className="mt-2 text-[42px] leading-tight font-extrabold tracking-[-1.5px]">
                {movie.title}
              </h1>
              <div className="mt-5 flex items-center gap-3 text-sm text-white/75">
                <span>{movie.release_date || "개봉일 정보 없음"}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.genres.map((genre) => genre.name).join(" · ") || "장르 정보 없음"}</span>
                <span aria-hidden="true">·</span>
                <span>{runtime}</span>
              </div>
              {movie.tagline && <h2 className="mt-10 text-2xl font-bold">{movie.tagline}</h2>}
              <p className="mt-4 text-base leading-7 text-white/75">
                {movie.overview}
              </p>
              <BookmarkButton
                movieId={movie.id}
                movieTitle={movie.title}
                variant="detail"
              />
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
