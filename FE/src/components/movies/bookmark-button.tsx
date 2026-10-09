// 이 파일은 목록·검색·상세 화면에서 함께 쓰는 북마크 버튼이다.
// 버튼마다 저장 로직을 작성하지 않도록 Zustand 상태 조회와 클릭 동작을 모았다.
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className = "",
}: BookmarkButtonProps) {
  // 전달받은 movieId에 해당하는 상태만 읽어 현재 버튼 문구를 정한다.
  const isBookmarked = useBookmarkStore((state) => state.isBookmarked(movieId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 아이콘은 모양만 담당하고, aria-label과 aria-pressed가 영화와 선택 상태를 알려준다.
  return (
    <button
      type="button"
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        isBookmarked
          ? "bg-white hover:bg-gray-200"
          : "bg-black/70 hover:bg-black/90",
        className,
      )}
    >
      <img
        src={
          isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
        className={cn("h-5 w-5", !isBookmarked && "invert")}
      />
    </button>
  );
}
