import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
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

          {/* Poster Gradient */}
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

        {/* Bookmark */}
        <button
          type="button"
          onClick={() => onToggleBookmark(movie.id)}
          aria-label={
            movie.isBookmarked
              ? "북마크 해제"
              : "북마크 추가"
          }
          aria-pressed={movie.isBookmarked}
          className={cn(
            `
              absolute
              right-3
              top-3
              z-10
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              backdrop-blur-md
              transition
              duration-200
              hover:scale-110
              active:scale-95
            `,
            movie.isBookmarked
              ? "border-white/30 bg-white text-zinc-950 shadow-lg"
              : "border-white/20 bg-black/55 text-white shadow-md",
          )}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
            aria-hidden="true"
            className="h-5 w-5 object-contain"
          />
        </button>
      </div>

      {/* Movie Information */}
      <div className="flex min-h-[180px] flex-col p-4">
        {/* Release Date */}
        <p className="mb-1 text-xs font-medium text-zinc-400">
          {movie.releaseDate}
        </p>

        {/* Title */}
        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
          className="
            transition
            hover:text-zinc-600
          "
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

        {/* Original Title */}
        <p
          className="
            mt-1
            truncate
            text-sm
            text-zinc-400
          "
        >
          {movie.originalTitle}
        </p>

        {/* Runtime */}
        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span>{movie.releaseDate}</span>

          <span className="text-zinc-300">•</span>

          <span>{movie.runtime}</span>
        </div>

        {/* Genre */}
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