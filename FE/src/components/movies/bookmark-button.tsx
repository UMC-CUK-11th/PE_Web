import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
}

export default function BookmarkButton({
  movieId,
  movieTitle,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={`${movieTitle} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "absolute right-2 top-2 flex size-11 cursor-pointer items-center justify-center rounded-full text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        isBookmarked
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-black/60 hover:bg-black/80",
      )}
    >
      <img
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        className="size-5 invert"
      />
    </button>
  );
}
