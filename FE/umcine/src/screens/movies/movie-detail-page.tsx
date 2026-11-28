"use client";

import Image from "next/image";
import Link from "next/link";
import { RatingPanel } from "../../components/ratings/rating-panel";
import { BookmarkButton } from "../../components/bookmark-button";
import { useQuery } from "@tanstack/react-query";
import { movieDetailOptions } from "../../api/movies/movie-query-options";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { RetryButton } from "../../components/retry-button";


export function MovieDetailPage({ movieId }: { movieId: string }) {
  return <MovieDetailContent key={movieId} parsedMovieId={Number(movieId)} />;
}

function MovieDetailContent({ parsedMovieId }: { parsedMovieId: number }) {
  const isValidMovieId = Number.isSafeInteger(parsedMovieId) && parsedMovieId > 0;
  const movieDetailQuery = useQuery(movieDetailOptions(parsedMovieId));
  const movie = movieDetailQuery.data;
  const isLoading = movieDetailQuery.isPending;
  const errorMessage = movieDetailQuery.isError
    ? getMovieDetailErrorMessage(movieDetailQuery.error)
    : null;

  if (!isValidMovieId || isLoading || errorMessage || !movie) {
    return (
      <main className="grid min-h-[calc(100vh-112px)] place-content-center px-5 text-center">
        <p className="text-lg font-extrabold" role={!isValidMovieId || errorMessage ? "alert" : "status"}>
          {!isValidMovieId ? "올바르지 않은 영화 번호예요." : isLoading ? "영화 정보를 불러오는 중이에요." : errorMessage ?? "영화를 찾을 수 없어요."}
        </p>
        {isValidMovieId && !isLoading && errorMessage && <RetryButton onRetry={() => void movieDetailQuery.refetch()} />}
        <Link className="mt-3 text-sm font-bold text-[#2563eb] no-underline hover:underline" href="/">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const genres = movie.genres.map((genre) => genre.name).join(", ");
  const runtime = typeof movie.runtime === "number"
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영 시간 정보가 없어요.";

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[#f7f8fb]">
      <section className="relative h-[300px] overflow-hidden text-white md:h-[360px]">
        {backdropUrl ? (
          <Image className="absolute inset-0 h-full w-full object-cover object-center" src={backdropUrl} fill sizes="100vw" alt="" />
        ) : (
          <div className="absolute inset-0 grid h-full w-full place-content-center bg-[#696c73] text-sm">이미지 없음</div>
        )}
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/10" />

        <div className="relative mx-auto flex h-full w-full max-w-[1264px] flex-col px-4 md:px-8">
          <Link className="mt-5 w-fit text-[11px] font-semibold text-white/80 no-underline hover:text-white" href="/">
            ← 영화 목록
          </Link>
          <div className="mt-auto pb-8 md:pb-10 md:pl-[272px]">
            <p className="mb-2 text-[11px] font-semibold text-white/75">{movie.original_title}</p>
            <h1 className="text-2xl font-extrabold tracking-[-0.8px] md:text-[32px]">{movie.title}</h1>
            <p className="mt-2 text-[11px] text-white/75">
              {movie.release_date} · {genres} · {runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1264px] gap-7 px-4 pb-16 md:grid-cols-[224px_minmax(0,1fr)_260px] md:gap-8 md:px-8">
        {posterUrl ? <Image
          className="relative z-10 -mt-20 hidden aspect-[2/3] w-full rounded-[4px] object-cover shadow-[0_12px_34px_rgba(20,21,25,0.2)] md:block"
          src={posterUrl} width={224} height={336} sizes="(max-width: 640px) 45vw, 224px"
          alt={`${movie.title} 포스터`}
        /> : <div className="relative z-10 -mt-20 hidden aspect-[2/3] w-full place-content-center rounded-[4px] bg-[#dedfe3] text-xs text-[#696c73] shadow-[0_12px_34px_rgba(20,21,25,0.2)] md:grid">이미지 없음</div>}

        <article className="pt-8 md:pt-9">
          <h2 className="text-base font-extrabold tracking-[-0.4px]">{movie.tagline}</h2>
          <dl className="mt-4 grid grid-cols-[64px_1fr] gap-y-2 text-[11px]">
            <dt className="font-bold text-[#8b8e96]">개봉일</dt>
            <dd>{movie.release_date}</dd>
            <dt className="font-bold text-[#8b8e96]">장르</dt>
            <dd>{genres}</dd>
            <dt className="font-bold text-[#8b8e96]">상영 시간</dt>
            <dd>{runtime}</dd>
          </dl>
          <p className="mt-5 max-w-2xl text-xs leading-6 text-[#5f626a]">{movie.overview}</p>
          <BookmarkButton movieId={movie.id} movieTitle={movie.title} variant="detail" />
        </article>

        <RatingPanel movieId={movie.id} />
      </section>
    </main>
  );
}
