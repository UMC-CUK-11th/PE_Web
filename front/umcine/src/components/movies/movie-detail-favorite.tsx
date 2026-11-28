"use client";

import Image from "next/image";
import { useFavorite } from "@/hooks/use-favorite";
import { getApiErrorMessage } from "@/utils/get-api-error-message";

export function MovieDetailFavorite({ movieId }: { movieId: number }) {
  const favorite = useFavorite(movieId, true);
  const isBookmarked = favorite.isFavorite;

  return (
    <>
      <button
        className="mt-3 inline-flex h-[26px] items-center gap-1 rounded bg-[#2f65dd] px-2 text-[10px] font-bold text-white disabled:opacity-50"
        type="button"
        aria-pressed={isBookmarked}
        disabled={favorite.isLoading || favorite.isPending}
        onClick={favorite.toggle}
      >
        <Image width={12} height={12} className="h-3 w-3 invert" src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        {favorite.isLoading ? "확인 중" : favorite.isPending ? "처리 중" : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      </button>
      {favorite.error && (
        <div className="mt-2 text-[11px] text-red-700">
          <p role="alert">{getApiErrorMessage(favorite.error, "즐겨찾기를 처리하지 못했어요.")}</p>
          <button type="button" className="mt-1 text-[#2865e7]" onClick={favorite.retry}>다시 시도</button>
        </div>
      )}
    </>
  );
}
