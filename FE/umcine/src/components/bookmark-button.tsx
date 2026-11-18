import { useNavigate } from "@tanstack/react-router";
import { useFavorite } from "../hooks/use-favorite";
import { getApiErrorMessage } from "../utils/get-api-error-message";

interface BookmarkButtonProps {
  movieId: number;
  variant: "detail" | "grid";
}

export function BookmarkButton({ movieId, variant }: BookmarkButtonProps) {
  const navigate = useNavigate();
  const { accessToken, isFavorite: isBookmarked, query, mutation } = useFavorite(movieId, variant);

  async function handleToggle() {
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }
    if (mutation.isPending || query.isFetching) return;
    if (query.isError) {
      await query.refetch();
      return;
    }
    mutation.mutate(undefined, {
      onError: (error) => alert(getApiErrorMessage(error, "즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.")),
    });
  }

  const isGrid = variant === "grid";

  return (
    <button
      id={isGrid ? undefined : "bookmark-button"}
      type="button"
      onClick={handleToggle}
      disabled={Boolean(accessToken) && (query.isFetching || mutation.isPending)}
      aria-label={query.isError ? "즐겨찾기 다시 불러오기" : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      title={query.isError ? "즐겨찾기를 불러오지 못했어요. 눌러서 다시 시도해 주세요." : undefined}
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

      {!isGrid && (mutation.isPending ? "변경 중" : query.isError ? "다시 시도" : "즐겨찾기")}
    </button>
  );
}
