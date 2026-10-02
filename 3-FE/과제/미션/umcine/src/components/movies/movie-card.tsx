import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

export function MovieCard({
  movie,
  onToggleBookmark,
}: {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}) {
  // 5-미니 실습, 7-미니 실습
  return (
    <article>
      <div className="relative aspect-[240/274] overflow-hidden rounded-lg bg-slate-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="h-full w-full object-cover"
          />
        </Link>
        <button
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute top-3 right-3 grid h-9 w-8 place-items-center rounded-md",
            movie.isBookmarked ? "bg-[#245de8]" : "bg-black/75",
          )}
        >
          <img
            src="/icons/bookmark.svg"
            alt=""
            className="size-5 brightness-0 invert"
          />
        </button>
      </div>
      <h2 className="mt-3 mb-1.5 text-[15px] leading-snug font-bold wrap-anywhere">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <time
        className="text-[13px] text-[#6a7081]"
        dateTime={movie.releaseDate.replaceAll(".", "-")}
      >
        {movie.releaseDate}
      </time>
    </article>
  );
}
