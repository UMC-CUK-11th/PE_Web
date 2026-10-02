import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

type MovieCardProps = {
  id: number;
  title: string;
  releaseDate: string;
  poster: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
};

function MovieCard({
  id,
  title,
  releaseDate,
  poster,
  isBookmarked,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(id) }}
          className="block"
        >
          <img
            className="aspect-[2/3] w-full object-cover"
            src={poster}
            alt={title}
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition",
            isBookmarked && "bg-black/70"
          )}
          onClick={onToggleBookmark}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          <img
            className="h-5 w-5"
            src={
              isBookmarked
                ? "/icons/movie-icons/bookmark.svg"
                : "/icons/movie-icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(id) }}
        className="mt-3 block"
      >
        <h2 className="truncate text-base font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {releaseDate}
        </p>
      </Link>
    </div>
  );
}

export default MovieCard;