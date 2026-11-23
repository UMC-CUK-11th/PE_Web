import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createFavorite, deleteFavorite, getFavoriteStatus } from "../../api/favorites";
import { useFavoritesQuery, useMemberId } from "../../hooks/use-member-queries";
import { useAuthStore } from "../../stores/auth-store";
import { apiErrorMessage } from "../../utils/api-error-message";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps { movieId: number; movieTitle: string; className?: string; checkStatus?: boolean }
export function BookmarkButton({ movieId, movieTitle, className = "", checkStatus = false }: BookmarkButtonProps) {
  const token = useAuthStore(state => state.accessToken);
  const memberId = useMemberId();
  const favorites = useFavoritesQuery();
  const status = useQuery({ queryKey: ["favorites", memberId, "status", movieId],
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal), enabled: Boolean(token) && checkStatus, retry: false });
  const isBookmarked = checkStatus ? status.data?.isFavorite ?? false : favorites.data?.some(item => item.movieId === movieId) ?? false;
  const query = checkStatus ? status : favorites;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: async () => {
      if (isBookmarked) await deleteFavorite(movieId);
      else await createFavorite(movieId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", memberId] }),
    onError: error => {
      setMessage(apiErrorMessage(error));
      void queryClient.invalidateQueries({ queryKey: ["favorites", memberId] });
    },
  });
  return <span className={cn("inline-flex flex-col items-start", className)}>
    <button type="button" aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`} aria-pressed={isBookmarked}
      disabled={mutation.isPending || (Boolean(token) && (query.isLoading || query.isError))}
      onClick={() => { setMessage(""); if (!token) { void navigate({ to: "/login" }); return; } mutation.mutate(); }}
      className={cn("flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-white",
        isBookmarked ? "bg-white hover:bg-gray-200" : "bg-black/70 hover:bg-black/90")}>
      <img src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" aria-hidden="true" className={cn("h-5 w-5", !isBookmarked && "invert")} />
    </button>
    {(message || query.isError) && <span role="alert" className="max-w-48 rounded bg-black/90 p-1 text-xs text-red-300">{message || "즐겨찾기를 불러오지 못했어요."}</span>}
  </span>;
}
