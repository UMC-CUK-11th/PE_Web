"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { favoriteKey, favoriteListKey, favoriteOptions, favoritesOptions } from "../api/private-query-options";
import { changeFavoriteOptions } from "../api/mutation-options";
import { memberErrorMessage } from "../api/api-client";
import { cn } from "../utils/cn";

interface BookmarkButtonProps { movieId: number; movieTitle: string; variant?: "card" | "detail" | "search" }
export function BookmarkButton({ movieId, movieTitle, variant = "card" }: BookmarkButtonProps) {
  const { accessToken, sessionVersion } = useAuthStore();
  const navigate = useRouter();
  const client = useQueryClient();
  const lock = useRef(false);
  const list = useQuery({ ...favoritesOptions(sessionVersion), enabled: !!accessToken && variant !== "detail" });
  const status = useQuery({ ...favoriteOptions(sessionVersion, movieId), enabled: !!accessToken && variant === "detail" });
  const query = variant === "detail" ? status : list;
  const isFavorite = variant === "detail" ? status.data?.isFavorite === true : list.data?.some((item) => item.movieId === movieId) === true;
  const mutation = useMutation({ ...changeFavoriteOptions(), onSuccess: async (_response, variables) => {
    client.setQueryData(favoriteKey(sessionVersion, movieId), { movieId, isFavorite: !variables.remove });
    await client.invalidateQueries({ queryKey: favoriteListKey(sessionVersion) });
  }, onError: () => {
    void client.invalidateQueries({ queryKey: favoriteKey(sessionVersion, movieId) });
    void client.invalidateQueries({ queryKey: favoriteListKey(sessionVersion) });
  }, onSettled: () => { lock.current = false; } });

  function toggle() {
    if (!accessToken) { navigate.push("/login"); return; }
    if (lock.current || mutation.isPending || query.isLoading) return;
    if (query.isError) { void query.refetch(); return; }
    lock.current = true;
    mutation.mutate({ movieId, remove: isFavorite });
  }

  return <>
    <button type="button" aria-label={`${movieTitle} ${isFavorite ? "북마크 해제" : "북마크 추가"}`} aria-pressed={isFavorite}
      disabled={mutation.isPending || (!!accessToken && query.isLoading)} onClick={toggle}
      className={cn("inline-flex items-center justify-center gap-1.5 rounded text-xs font-bold transition disabled:cursor-wait disabled:opacity-50",
        variant === "card" ? "absolute right-2 top-2 size-8 border border-white/50 bg-black/75 text-white" : "mt-4 border border-blue-200 bg-white px-4 py-2 text-blue-700",
        isFavorite && "!bg-blue-600 !text-white")}>
      <img className={cn("size-4", (variant === "card" || isFavorite) && "invert")} src={`/icons/movie-icons/movie-icons/${isFavorite ? "bookmark.svg" : "bookmark-outline.svg"}`} alt="" />
      {variant !== "card" && (mutation.isPending ? "처리 중…" : isFavorite ? "북마크 해제" : "북마크 추가")}
    </button>
    {(mutation.isError || query.isError) && <p role="alert" className={cn("mt-2 text-xs text-red-600", variant === "card" && "absolute inset-x-1 bottom-1 rounded bg-white p-2")}>{memberErrorMessage(mutation.error ?? query.error)}{query.isError && " 버튼을 눌러 다시 확인해 주세요."}</p>}
  </>;
}
