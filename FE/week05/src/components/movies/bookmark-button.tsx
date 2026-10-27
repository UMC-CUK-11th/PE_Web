import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "overlay" | "inline" | "detail";
}

export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "inline",
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "cursor-pointer transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500/50",
        variant === "overlay" &&
          "absolute top-2.5 right-2.5 z-10 grid size-[34px] place-items-center rounded-lg border p-0 shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:-translate-y-px",
        variant === "overlay" && isBookmarked
          ? "border-[#2f71f0] bg-[#2f71f0]"
          : variant === "overlay"
            ? "border-white/50 bg-[#14171d]/80 hover:bg-[#14171d]/95"
            : "",
        variant === "inline" &&
          "mt-auto inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold",
        variant === "inline" && isBookmarked
          ? "border-[#2669ee] bg-[#eef4ff] text-[#2669ee]"
          : variant === "inline"
            ? "border-[#d9dde5] bg-white text-[#5b606b] hover:border-[#2669ee] hover:text-[#2669ee]"
            : "",
        variant === "detail" &&
          "mt-7 inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold",
        variant === "detail" && isBookmarked
          ? "border-[#4c82f2] bg-[#2669ee] text-white"
          : variant === "detail"
            ? "border-white/35 bg-black/25 text-white hover:bg-white/15"
            : "",
      )}
      type="button"
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className={cn(
          variant === "overlay" ? "size-6 invert" : "size-5",
          variant === "detail" && "invert",
        )}
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
      {variant !== "overlay" &&
        (isBookmarked ? "북마크 해제" : "북마크 추가")}
    </button>
  );
}
