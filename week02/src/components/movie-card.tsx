import { Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { cn } from "../utils/cn";

interface MovieCardProps {
  movie: Movie;
  isBookmarked: boolean;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieCard({ movie, isBookmarked, onBookmarkToggle }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[7/8] overflow-hidden rounded-[10px] bg-[#e9ebee]">
        <Link className="block size-full" to={`/movies/${movie.id}`} aria-label={`${movie.title} 상세 보기`}>
          <img className="block size-full object-cover object-[center_28%]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
        </Link>
        <button
          className={cn(
            "absolute right-2.5 top-2.5 grid size-9 cursor-pointer place-items-center rounded-lg border border-white/90 bg-[#181b1fd1] p-0 shadow-md transition hover:-translate-y-px",
            isBookmarked && "border-[#2877eb] bg-[#2877eb]",
          )}
          type="button"
          aria-label={`${movie.title} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
          aria-pressed={isBookmarked}
          onClick={() => onBookmarkToggle(movie.id)}
        >
          <img className="size-6" src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        </button>
      </div>
      <h2 className="mt-2 mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold leading-[1.35] tracking-[-0.35px] text-[#202124]">
        <Link className="text-inherit no-underline" to={`/movies/${movie.id}`}>{movie.title}</Link>
      </h2>
      <time className="block text-xs leading-[1.35] text-[#9ba1aa]" dateTime={movie.releaseDate.replaceAll(".", "-")}>
        {movie.releaseDate}
      </time>
    </article>
  );
}
