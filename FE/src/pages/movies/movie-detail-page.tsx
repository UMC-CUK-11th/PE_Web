// 상세 응답의 genres·runtime 등을 그대로 사용하고 영화 ID로 북마크 상태를 공유한다.
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 워크북 방식으로 ID 변경 시 이전 상세 데이터를 비우고 요청 상태를 초기화한다.
    setMovie(null);
    setErrorMessage(null);
    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }
    async function loadMovie() {
      setIsLoading(true);
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
    return () => { ignore = true; };
  }, [parsedMovieId, isValidMovieId]);

  const statusMessage = !isValidMovieId ? "올바르지 않은 영화 번호예요."
    : isLoading ? "영화 정보를 불러오는 중이에요."
    : errorMessage ?? (!movie ? "영화를 찾을 수 없어요." : null);

  if (statusMessage || !movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-5 py-20 text-center">
        <h1 role={!isValidMovieId || errorMessage ? "alert" : "status"} className="text-2xl font-bold">{statusMessage}</h1>
        <Link to="/" className="mt-6 inline-block text-[#e50914]">영화 목록으로 돌아가기</Link>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtime = typeof movie.runtime === "number"
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영 시간 정보가 없어요.";

  return (
    <main>
      <section className="relative isolate min-h-[560px] overflow-hidden">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
        ) : (
          <div className="absolute inset-0 -z-20 flex items-start justify-end bg-gray-700 p-5 text-gray-300">이미지 없음</div>
        )}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#141517] via-[#141517]/80 to-[#141517]/30" />
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:py-20">
          {posterUrl ? (
            <img src={posterUrl} alt={`${movie.title} 포스터`} className="aspect-[2/3] w-48 rounded-lg object-cover shadow-2xl md:w-64" />
          ) : (
            <div className="flex aspect-[2/3] w-48 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-gray-300 md:w-64">이미지 없음</div>
          )}
          <div className="max-w-2xl">
            <Link to="/" className="text-sm font-bold text-[#e50914]">← 영화 목록</Link>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">{movie.title}</h1>
            <p className="mt-2 text-lg text-gray-300">{movie.original_title}</p>
            <p className="mt-5 text-gray-300">{movie.release_date || "개봉일 정보 없음"} · {movie.genres.map((genre) => genre.name).join(", ") || "장르 정보 없음"} · {runtime}</p>
            <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-5" />
            {movie.tagline && <h2 className="mt-8 text-xl font-bold">{movie.tagline}</h2>}
            <p className="mt-3 leading-7 text-gray-200">{movie.overview || "줄거리 정보가 없어요."}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
