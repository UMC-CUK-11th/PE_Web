import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavorite, getFavorite, getFavorites, removeFavorite, type Favorite } from "../../api/favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "overlay" | "inline" | "detail";
}

export function BookmarkButton({ movieId, movieTitle, variant = "inline" }: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDetail = variant === "detail";
  const listQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken) && !isDetail,
  });
  const detailQuery = useQuery({
    queryKey: ["favorites", "detail", movieId],
    queryFn: () => getFavorite(movieId),
    enabled: Boolean(accessToken) && isDetail,
  });
  const isBookmarked = isDetail
    ? detailQuery.data ?? false
    : listQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false;
  const isLoading = Boolean(accessToken) && (isDetail ? detailQuery.isPending : listQuery.isPending);
  const isError = Boolean(accessToken) && (isDetail ? detailQuery.isError : listQuery.isError);

  const mutation = useMutation({
    mutationFn: () => isBookmarked ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: () => {
      queryClient.setQueryData<boolean>(["favorites", "detail", movieId], !isBookmarked);
      queryClient.setQueryData<Favorite[]>(["favorites", "list"], (old) => {
        if (!old) return old;
        return isBookmarked
          ? old.filter((favorite) => favorite.movieId !== movieId)
          : [...old, { movieId, title: movieTitle }];
      });
    },
    onError: () => alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요."),
  });

  const handleClick = () => {
    if (!accessToken) {
      void navigate({ to: "/login" });
      return;
    }
    if (isError) {
      void queryClient.invalidateQueries({ queryKey: isDetail ? ["favorites", "detail", movieId] : ["favorites", "list"] });
      return;
    }
    mutation.mutate();
  };

  const label = !accessToken ? "로그인 후 즐겨찾기" : isError ? "즐겨찾기 다시 시도" : isLoading ? "확인 중" : mutation.isPending ? "저장 중" : isBookmarked ? "북마크 해제" : "북마크 추가";

  return (
    <button
      className={cn(
        "cursor-pointer transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-500/50",
        variant === "overlay" && "absolute top-2.5 right-2.5 z-10 grid size-[34px] place-items-center rounded-lg border p-0 shadow-[0_2px_8px_rgba(0,0,0,0.18)] hover:-translate-y-px",
        variant === "overlay" && (isBookmarked ? "border-[#2f71f0] bg-[#2f71f0]" : "border-white/50 bg-[#14171d]/80 hover:bg-[#14171d]/95"),
        variant === "inline" && "mt-auto inline-flex w-fit items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold",
        variant === "inline" && (isBookmarked ? "border-[#2669ee] bg-[#eef4ff] text-[#2669ee]" : "border-[#d9dde5] bg-white text-[#5b606b] hover:border-[#2669ee] hover:text-[#2669ee]"),
        variant === "detail" && "mt-7 inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold",
        variant === "detail" && (isBookmarked ? "border-[#4c82f2] bg-[#2669ee] text-white" : "border-white/35 bg-black/25 text-white hover:bg-white/15"),
      )}
      type="button"
      aria-label={`${movieTitle} ${label}`}
      aria-pressed={isBookmarked}
      disabled={isLoading || mutation.isPending}
      onClick={handleClick}
    >
      <img className={cn(variant === "overlay" ? "size-6 invert" : "size-5", variant === "detail" && "invert")} src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
      {variant !== "overlay" && label}
    </button>
  );
}
