import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({ movieId, movieTitle, className }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border p-0 shadow-md transition hover:-translate-y-px",
        isBookmarked
          ? "border-[#2877eb] bg-[#2877eb]"
          : "border-white/90 bg-[#181b1fd1]",
        className,
      )}
      type="button"
      title={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="size-5 brightness-0 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
