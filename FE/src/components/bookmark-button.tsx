import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      className={cn(
        "absolute right-[10px] top-[10px] cursor-pointer rounded-full border-0 p-2",
        isBookmarked ? "bg-blue-600" : "bg-black/60",
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="h-7 w-7"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
