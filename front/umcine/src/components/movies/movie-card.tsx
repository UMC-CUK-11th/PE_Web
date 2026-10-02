import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, isBookmarked, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[0.88] overflow-hidden rounded-lg bg-[#dfe2e8]">
        <Link className="block h-full w-full" params={{ movieId: String(movie.id) }} to="/movies/$movieId">
          <img className="block h-full w-full object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          className={cn(
            "absolute top-[6px] right-[6px] grid h-6 w-6 place-items-center rounded-[5px] border border-white/85 bg-[rgba(15,18,25,0.72)] p-0.5",
            isBookmarked && "border-[#2f65dd] bg-[#2f65dd]",
          )}
          type="button"
          aria-label={`${movie.title} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img className="h-4 w-4 invert" src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        </button>
      </div>
      <Link className="block overflow-hidden text-inherit no-underline" params={{ movieId: String(movie.id) }} to="/movies/$movieId">
        <h2 className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] leading-[1.2] font-bold tracking-[-0.3px] text-[#222731]" title={movie.title}>{movie.title}</h2>
      </Link>
      <div className="mt-0.5 flex items-center gap-1 text-[9px] leading-[1.2] text-[#7b818c]">
        <time dateTime={movie.releaseDate.replaceAll(".", "-")}>{movie.releaseDate}</time>
      </div>
    </article>
  );
}
