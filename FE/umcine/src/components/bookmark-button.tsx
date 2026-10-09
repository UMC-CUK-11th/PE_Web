import { useBookmarkStore } from "../stores/bookmark-store";

interface BookmarkButtonProps {
  movieId: number;
  variant: "detail" | "grid";
}

export function BookmarkButton({ movieId, variant }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const isGrid = variant === "grid";

  return (
    <button
      id={isGrid ? undefined : "bookmark-button"}
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-label={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      aria-pressed={isBookmarked}
      className={`flex cursor-pointer items-center justify-center rounded-lg text-white ${
        isGrid
          ? "absolute right-2 top-3 h-[34px] w-[34px]"
          : "mr-[6px] mt-3 h-[42px] w-[107px] gap-1 text-sm font-semibold"
      } ${isBookmarked ? "bg-[#2563eb]" : "bg-black/60"}`}
    >
      <svg
        className={isGrid ? "h-6 w-6 shrink-0" : "h-4 w-4 shrink-0"}
        viewBox="0 0 24 24"
        fill={isBookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isGrid ? "2" : "3"}
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 4h12v16l-6-4-6 4V4Z" />
      </svg>

      {!isGrid && "즐겨찾기"}
    </button>
  );
}
