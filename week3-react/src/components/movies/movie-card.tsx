import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[2/2.82] overflow-hidden rounded-lg bg-[#e7e9ee] shadow-[0_1px_2px_rgba(17,24,39,0.08)]">
        <Link
          className="block h-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-500/50"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <img
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            "absolute top-2.5 right-2.5 z-10 grid size-[34px] cursor-pointer place-items-center rounded-lg border p-0 shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition hover:-translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500/50",
            movie.isBookmarked
              ? "border-[#2f71f0] bg-[#2f71f0]"
              : "border-white/50 bg-[#14171d]/80 hover:bg-[#14171d]/95",
          )}
          type="button"
          aria-label={`${movie.title} 북마크 ${movie.isBookmarked ? "해제" : "추가"}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="size-6 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <h2 className="mt-3 mb-[5px] overflow-hidden text-[15px] leading-[1.4] font-bold tracking-[-0.35px] text-ellipsis whitespace-nowrap text-[#202228]">
        <Link
          className="text-inherit no-underline hover:text-[#2669ee]"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>
      <time
        className="text-xs leading-[1.4] text-[#8c919b]"
        dateTime={movie.releaseDate.replaceAll(".", "-")}
      >
        {movie.releaseDate}
      </time>
    </article>
  );
}
