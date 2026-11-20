import { useNavigate } from "@tanstack/react-router";
import { useFavoritesQuery, useToggleFavoriteMutation } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  title: string;
  overlay?: boolean;
  // 상세 화면은 GET /favorites/{movieId}로 받은 값을 넘긴다. 없으면 내 즐겨찾기 목록에서 찾는다
  isFavorite?: boolean;
}

export function FavoriteButton({ movieId, title, overlay = false, isFavorite }: FavoriteButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const favoritesQuery = useFavoritesQuery();
  const toggle = useToggleFavoriteMutation();

  const listed = favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;
  const pressed = Boolean(accessToken) && (isFavorite ?? listed);

  function handleClick() {
    if (!accessToken) {
      navigate({ to: "/login" });
      return;
    }
    toggle.mutate({ movieId, isFavorite: pressed });
  }

  return (
    <button
      type="button"
      aria-label={`${title} 즐겨찾기`}
      aria-pressed={pressed}
      disabled={toggle.isPending}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60",
        overlay ? "absolute top-3 right-3 h-9 w-8" : "mt-4 px-4 py-2",
        pressed ? "bg-[#245de8]" : "bg-slate-800",
      )}
    >
      <img src="/icons/bookmark.svg" alt="" className="size-5 brightness-0 invert" />
      {!overlay && (pressed ? "즐겨찾기 해제" : "즐겨찾기 추가")}
    </button>
  );
}
