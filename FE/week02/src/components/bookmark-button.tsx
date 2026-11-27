"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  addFavoriteMutationOptions,
  deleteFavoriteMutationOptions,
  favoriteQueryKeys,
  favoritesQueryOptions,
  favoriteStatusQueryOptions,
} from "../api/favorite-query-options";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
  useDetailStatus?: boolean;
}

export function BookmarkButton({ movieId, movieTitle, className, useDetailStatus = false }: BookmarkButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthStore((state) => Boolean(state.accessToken));
  const favoritesQuery = useQuery(favoritesQueryOptions(isLoggedIn && !useDetailStatus));
  const statusQuery = useQuery(favoriteStatusQueryOptions(movieId, isLoggedIn && useDetailStatus));
  const isBookmarked = useDetailStatus
    ? (statusQuery.data ?? false)
    : (favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ?? false);

  const syncFavoriteQueries = async (nextStatus: boolean) => {
    queryClient.setQueryData(favoriteQueryKeys.status(movieId), nextStatus);
    await queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.list() });
  };

  const addMutation = useMutation({
    ...addFavoriteMutationOptions(),
    onSuccess: () => syncFavoriteQueries(true),
  });
  const deleteMutation = useMutation({
    ...deleteFavoriteMutationOptions(),
    onSuccess: () => syncFavoriteQueries(false),
  });
  const isPending = addMutation.isPending || deleteMutation.isPending;

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (isBookmarked) deleteMutation.mutate(movieId);
    else addMutation.mutate(movieId);
  };

  return (
    <button
      className={cn(
        "grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border p-0 shadow-md transition hover:-translate-y-px",
        isBookmarked
          ? "border-[#2877eb] bg-[#2877eb]"
          : "border-white/90 bg-[#181b1fd1]",
        className,
      )}
      type="button"
      title={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-label={`${movieTitle} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      disabled={isPending}
      onClick={handleClick}
    >
      <img
        className="size-5 brightness-0 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
