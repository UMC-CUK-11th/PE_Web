import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  title: string;
  overlay?: boolean;
}

// 4.2
export function BookmarkButton({
  movieId,
  title,
  overlay = false,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  return (
    <button
      type="button"
      aria-label={`${title} 북마크`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md text-sm font-semibold text-white",
        overlay ? "absolute top-3 right-3 h-9 w-8" : "mt-4 px-4 py-2",
        isBookmarked ? "bg-[#245de8]" : "bg-slate-800",
      )}
    >
      <img
        src="/icons/bookmark.svg"
        alt=""
        className="size-5 brightness-0 invert"
      />
      {!overlay && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
