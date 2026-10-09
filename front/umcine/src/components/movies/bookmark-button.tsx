import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movie: Movie;
  className?: string;
}

export function BookmarkButton({ movie, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "absolute top-[6px] right-[6px] grid h-6 w-6 place-items-center rounded-[5px] border border-white/85 bg-[rgba(15,18,25,0.72)] p-0.5",
        isBookmarked && "border-[#2f65dd] bg-[#2f65dd]",
        className,
      )}
      type="button"
      aria-label={`${movie.title} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movie.id)}
    >
      <img
        className="h-4 w-4 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
