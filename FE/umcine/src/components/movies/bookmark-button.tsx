import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
}

export default function BookmarkButton({
  movieId,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={() => toggleBookmark(movieId)}
        aria-pressed={isBookmarked}
        className={cn(
          `
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            px-5
            py-3
            text-sm
            font-bold
            transition
            duration-200
            hover:-translate-y-0.5
            active:translate-y-0
            active:scale-[0.98]
          `,
          isBookmarked
            ? "bg-white text-zinc-950 shadow-lg"
            : "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
          className,
        )}
      >
        <img
          src={
            isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
          }
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
        />

        {isBookmarked ? "북마크 해제" : "북마크 추가"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleBookmark(movieId)}
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      className={cn(
        `
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          backdrop-blur-md
          transition
          duration-200
          hover:scale-110
          active:scale-95
        `,
        isBookmarked
          ? "border-white/30 bg-white text-zinc-950 shadow-lg"
          : "border-white/20 bg-black/55 text-white shadow-md",
        className,
      )}
    >
      <img
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
        className="h-5 w-5 object-contain"
      />
    </button>
  );
}
