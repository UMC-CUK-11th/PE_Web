
import MovieImage from "./movie-image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import Link from "next/link";

import type { TmdbMovieListItem } from "../../api/movies/models";
import BookmarkButton from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article
      className="
        group relative w-full overflow-hidden rounded-2xl
        border border-[#26344c] bg-[#162238]
        shadow-lg shadow-black/10
        transition-all duration-300
        hover:-translate-y-1 hover:border-blue-500/60
        hover:shadow-xl hover:shadow-blue-950/40
        motion-reduce:transform-none
      "
    >
      <div className="relative overflow-hidden">
        <Link href={`/movies/${movie.id}`} className="block">
          <MovieImage
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            className="
              aspect-[2/3] w-full object-cover
              transition-transform duration-500
              group-hover:scale-[1.04]
              motion-reduce:transform-none
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-[#0b1120]/70
              via-transparent to-transparent
            "
          />
        </Link>

        <span className="absolute bottom-3 left-3 rounded-lg bg-[#0b1120]/85 px-2.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md">
          ★ {movie.vote_average.toFixed(1)}
        </span>

        <BookmarkButton
          movieId={movie.id}
          className="absolute right-3 top-3 z-10"
        />
      </div>

      <div className="flex min-h-[180px] flex-col p-4">
        <p className="mb-2 text-xs font-medium text-slate-400">
          {movie.release_date || "개봉일 미정"}
        </p>

        <Link
          href={`/movies/${movie.id}`}
          className="transition hover:text-blue-300"
        >
          <h2 className="line-clamp-2 text-[17px] font-bold leading-snug tracking-tight">
            {movie.title}
          </h2>
        </Link>

        <p className="mt-1 truncate text-sm text-slate-400">
          {movie.original_title}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="font-semibold text-amber-300">
            ★ {movie.vote_average.toFixed(1)}
          </span>

          <span className="text-slate-500">·</span>

          <span className="text-slate-400">
            TMDB 평점
          </span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          <span className="rounded-full border border-slate-700 bg-[#0b1120]/60 px-2.5 py-1 text-xs text-slate-300">
            평가 {movie.vote_count.toLocaleString()}개
          </span>
        </div>
      </div>
    </article>
  );
}
