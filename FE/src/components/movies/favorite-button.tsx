import { useNavigate } from "@tanstack/react-router";
import { useFavoriteStatusQuery, useToggleFavoriteMutation } from "../../hooks/use-favorite";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

// 영화 상세의 찜 버튼: 기존 북마크 버튼과 같은 모양으로, 서버의 즐겨찾기 API를 사용함
export function FavoriteButton({ movieId }: { movieId: number }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const statusQuery = useFavoriteStatusQuery(movieId);
  const toggleMutation = useToggleFavoriteMutation(movieId);
  const isFavorite = statusQuery.data === true;

  function handleClick() {
    if (!accessToken) {
      alert("로그인 후 찜할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }
    if (statusQuery.isPending || toggleMutation.isPending) return;
    toggleMutation.mutate(isFavorite);
  }

  return (
    <button
      type="button"
      aria-label={isFavorite ? "찜 해제" : "찜하기"}
      aria-pressed={isFavorite}
      disabled={toggleMutation.isPending}
      className={cn(
        "absolute right-[10px] top-[10px] cursor-pointer rounded-full border-0 p-2 disabled:opacity-60",
        isFavorite ? "bg-blue-600" : "bg-black/60",
      )}
      onClick={handleClick}
    >
      <img
        className="h-7 w-7"
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
