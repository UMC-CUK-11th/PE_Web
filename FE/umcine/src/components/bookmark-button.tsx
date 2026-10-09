import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "card" | "detail" | "search";
}

const iconPath = "/icons/movie-icons/movie-icons";

export function BookmarkButton({ movieId, movieTitle, variant = "card" }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "cursor-pointer transition",
        variant === "card" &&
          "absolute right-2 top-2 grid size-7 place-items-center rounded-[3px] border border-white/50 bg-black/75 hover:bg-black",
        variant === "card" && isBookmarked &&
          "border-[#2563eb] bg-[#2563eb] hover:bg-[#1d4ed8]",
        variant === "detail" &&
          "mt-5 inline-flex h-8 items-center rounded bg-[#2563eb] px-4 text-[10px] font-bold text-white hover:bg-[#1d4ed8]",
        variant === "detail" && isBookmarked && "bg-[#17181c] hover:bg-black",
        variant === "search" &&
          "mt-3 inline-flex h-7 items-center rounded border border-[#cfd1d7] bg-white px-2.5 text-[10px] font-bold text-[#4f5259] hover:border-[#2563eb] hover:text-[#2563eb]",
        variant === "search" && isBookmarked && "border-[#2563eb] text-[#2563eb]",
      )}
      type="button"
      aria-label={`${movieTitle} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className={cn("size-4", variant !== "search" && "invert", variant !== "card" && "mr-1.5")}
        src={`${iconPath}/${isBookmarked ? "bookmark.svg" : "bookmark-outline.svg"}`}
        alt=""
      />
      {variant !== "card" && (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
