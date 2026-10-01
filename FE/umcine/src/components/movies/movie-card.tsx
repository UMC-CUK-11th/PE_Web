import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import BookmarkButton from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
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
          <img
            src={movie.posterPath}
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
          {movie.releaseDate}
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
          {movie.originalTitle}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span>{movie.releaseDate}</span>

          <span className="text-zinc-300">•</span>

          <span>{movie.runtime}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="
                rounded-full
                bg-zinc-100
                px-2.5
                py-1
                text-[11px]
                font-medium
                text-zinc-600
              "
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
