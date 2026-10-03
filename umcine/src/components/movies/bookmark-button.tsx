import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

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
      className={cn(
        "absolute top-2 right-2 z-[2] m-0 flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-md border-0 bg-[rgba(23,25,30,0.8)] p-0",
        isBookmarked && "bg-[#3182f6]",
      )}
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="pointer-events-none block h-[18px] max-h-[18px] w-[14px] max-w-[14px] object-contain"
        src={
          isBookmarked
            ? "/movie-icons/bookmark.svg"
            : "/movie-icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
  );
}
