"use client";

import Image from "next/image";
import { useFavorite } from "../../hooks/use-favorite";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movie: { id: number; title: string };
  className?: string;
}

export function BookmarkButton({ movie, className }: BookmarkButtonProps) {
  const favorite = useFavorite(movie.id);
  const isBookmarked = favorite.isFavorite;

  return (
    <button
      className={cn(
        "absolute top-[6px] right-[6px] grid h-6 w-6 place-items-center rounded-[5px] border border-white/85 bg-[rgba(15,18,25,0.72)] p-0.5 disabled:opacity-50",
        isBookmarked && "border-[#2f65dd] bg-[#2f65dd]",
        className,
      )}
      type="button"
      aria-label={`${movie.title} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
      aria-pressed={isBookmarked}
      disabled={favorite.isLoading || favorite.isPending}
      title={favorite.error ? getApiErrorMessage(favorite.error, "즐겨찾기를 처리하지 못했어요.") : undefined}
      onClick={favorite.toggle}
    >
      <Image
        width={16}
        height={16}
        className="h-4 w-4 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
    </button>
  );
}
