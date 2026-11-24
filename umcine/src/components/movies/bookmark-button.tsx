import { useRouter } from "next/navigation";
import { useFavorite } from "../../hooks/use-favorites";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const router = useRouter();
  const { token, status, mutation } = useFavorite(movieId);
  const isBookmarked = Boolean(token && status.data?.isFavorite);
  const busy = Boolean(token) && (status.isLoading || mutation.isPending);
  function toggleBookmark() {
    if (!token) { router.push("/login"); return; }
    if (busy) return;
    if (status.isError) { status.refetch(); return; }
    if (!status.data) return;
    mutation.mutate(status.data.isFavorite);
  }

  return (
    <button
      className={cn(
        "absolute top-2 right-2 z-[2] m-0 flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-md border-0 bg-[rgba(23,25,30,0.8)] p-0",
        isBookmarked && "bg-[#3182f6]",
      )}
      type="button"
      aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
      aria-pressed={isBookmarked}
      disabled={busy}
      aria-busy={busy}
      title={status.isError ? "조회 실패: 눌러서 다시 확인" : undefined}
      onClick={toggleBookmark}
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
