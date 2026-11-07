import MovieImage from "./movie-image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { Link } from "@tanstack/react-router";

import type { TmdbMovieListItem } from "../../api/movies/models";
import BookmarkButton from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Poster */}
      <div className="relative overflow-hidden">
        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
          className="block"
        >
          <MovieImage
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
            className="
              aspect-[2/3]
              w-full
              object-cover
              transition
              duration-500
              group-hover:scale-[1.035]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/25
              via-transparent
              to-transparent
              opacity-0
              transition
              duration-300
              group-hover:opacity-100
            "
          />
        </Link>

        {/* Zustand Bookmark */}
        <BookmarkButton
          movieId={movie.id}
          className="absolute right-3 top-3 z-10"
        />
      </div>

      {/* Movie Information */}
      <div className="flex min-h-[180px] flex-col p-4">
        <p className="mb-1 text-xs font-medium text-zinc-400">
          {movie.release_date || "개봉일 미정"}
        </p>

        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
          className="transition hover:text-zinc-600"
        >
          <h2
            className="
              line-clamp-2
              text-[17px]
              font-bold
              leading-snug
              tracking-[-0.02em]
              text-zinc-950
            "
          >
            {movie.title}
          </h2>
        </Link>

        <p className="mt-1 truncate text-sm text-zinc-400">
          {movie.original_title}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span>{movie.release_date || "개봉일 미정"}</span>

          <span className="text-zinc-300">•</span>

          <span>{`★ ${movie.vote_average.toFixed(1)}`}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600">
            평가 {movie.vote_count.toLocaleString()}개
          </span>
        </div>
      </div>
    </article>
  );
}
