import Image from "next/image";
import Link from "next/link";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { MovieDetailFavorite } from "../../components/movies/movie-detail-favorite";
import { MovieRating } from "../../components/movies/movie-rating";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/tmdb-image";

function DetailSummary({ movie }: { movie: TmdbMovieDetail }) {
  return (
    <div className="pt-[3px]">
      <h2 className="mb-1 text-[15px] leading-[1.3] font-extrabold tracking-[-0.6px] text-[#252a34]">{movie.title}</h2>
      {movie.tagline && <p className="mb-2 text-[11px] leading-[1.5] font-bold text-[#373d48]">{movie.tagline}</p>}
      <p className="text-[11px] leading-[1.55] text-[#626975]">{movie.overview || "줄거리 정보가 없어요."}</p>
      <MovieDetailFavorite movieId={movie.id} />
    </div>
  );
}

export function DetailMessage({ message, isError = false }: { message: string; isError?: boolean }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-[#f6f7f9]">
      <main className="grid flex-1 place-content-center gap-[15px] text-center text-[#424955]">
        <p role={isError ? "alert" : "status"}>{message}</p>
        <Link className="text-[13px] text-[#2865e7] no-underline" href="/">영화 목록으로 돌아가기</Link>
      </main>
      <TmdbFooter />
    </div>
  );
}

export function MovieDetailContent({ movie }: { movie: TmdbMovieDetail }) {
  const genres = movie.genres.map((genre) => genre.name).join(" · ");
  const releaseDate = movie.release_date ? movie.release_date.replaceAll("-", ".") : "개봉일 미정";
  const runtime = movie.runtime == null ? "상영 시간 미정" : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-[#f6f7f9]">
      <main className="flex-1">
        <section className="relative h-[225px] bg-[#141b24]">
          {backdropUrl && <Image fill sizes="(min-width: 1120px) 1120px, 100vw" loading="eager" className="object-cover" src={backdropUrl} alt="" />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d14]/80 via-[#080d14]/40 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1120px] flex-col justify-end px-6 pt-[22px] pb-1 text-white md:px-12">
            <Link className="absolute top-[18px] text-[11px] font-bold text-white no-underline" href="/">‹ 영화 목록</Link>
            {genres && <p className="mb-[6px] text-[11px] font-bold opacity-85">{genres}</p>}
            <h1 className="mb-1 text-[23px] leading-[1.2] font-extrabold tracking-[-1.4px] text-white md:text-[28px]">{movie.title}</h1>
            <p className="text-[11px] opacity-90">{movie.original_title}</p>
            <p className="mt-1 text-[11px] opacity-90">{releaseDate} · {runtime}{genres && ` · ${genres}`}</p>
          </div>
        </section>

        <section className="mx-auto grid min-h-[310px] w-full max-w-[1120px] grid-cols-1 gap-[22px] bg-[#f6f7f9] px-6 pt-5 pb-[55px] md:grid-cols-[125px_minmax(0,1fr)_205px] md:px-12">
          {posterUrl ? (
            <Image width={125} height={175} className="h-[175px] w-[125px] rounded-[5px] object-cover shadow-[0_8px_18px_rgba(25,30,40,0.2)]" src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <div className="grid h-[175px] w-[125px] place-items-center rounded-[5px] bg-[#dfe2e8] text-xs text-[#687080]">포스터 없음</div>
          )}
          <DetailSummary movie={movie} />
          <MovieRating movieId={movie.id} />
        </section>
      </main>
      <TmdbFooter />
    </div>
  );
}

