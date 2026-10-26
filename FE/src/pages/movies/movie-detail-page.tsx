import { useCallback } from "react";
import { Link, useParams } from "@tanstack/react-router";
import BookmarkButton from "../../components/movies/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { RequestState } from "../../components/movies/request-state";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbPosterUrl, getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";
import { formatRuntime } from "../../utils/movies/movie-adapter";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const id = Number(movieId);
  const valid = Number.isSafeInteger(id) && id > 0;
  const load = useCallback(() => getMovieDetail(id), [id]);
  const { data: movie, error, isLoading, retry } = useMovieRequest(`detail:${id}`, load, valid);
  if (!valid || isLoading || error || !movie) {
    return <main className="mx-auto max-w-7xl px-6 py-12">
      {!valid ? <RequestState error="올바르지 않은 영화 번호예요." />
        : isLoading ? <RequestState loading />
        : <RequestState error={getMovieDetailErrorMessage(error)} onRetry={retry} />}
      <Link to="/" className="text-blue-700">영화 목록</Link>
    </main>;
  }
  return <main className="pb-16">
    <div className="relative h-52 overflow-hidden bg-slate-900 sm:h-80">
      <MovieImage src={getTmdbBackdropUrl(movie.backdrop_path)} alt={`${movie.title} 배경`} className="size-full object-cover opacity-70" />
    </div>
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <Link to="/" className="my-7 inline-flex text-sm font-semibold text-blue-700">← 영화 목록</Link>
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        <div className="relative w-48 shrink-0 self-start sm:w-60">
          <MovieImage src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} className="aspect-[2/3] w-full rounded-xl object-cover shadow-md" />
          <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
        </div>
        <div className="min-w-0 py-2">
          <h1 className="text-3xl leading-tight font-bold break-keep sm:text-4xl">{movie.title}</h1>
          <p className="mt-3 text-lg text-slate-500">{movie.original_title}</p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <p>{movie.release_date || "개봉일 정보 없음"}</p>
            <p>{movie.genres.map((genre) => genre.name).join(", ") || "장르 정보 없음"}</p>
            <p>{formatRuntime(movie.runtime)}</p>
          </div>
          <h2 className="mt-8 text-xl font-semibold">{movie.tagline}</h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate-600">{movie.overview || "줄거리 정보가 없어요."}</p>
        </div>
      </div>
    </div>
  </main>;
}
