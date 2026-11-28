"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFavorite } from "../../hooks/use-favorite";
import { useAuthStore } from "../../stores/auth-store";
import { getRequestErrorMessage } from "../../utils/auth/request-error";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
}

export default function BookmarkButton({
  movieId,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const { status, toggle, isToggling } = useFavorite(movieId);
  const isBookmarked = Boolean(accessToken && status.data?.isFavorite);
  const disabled = Boolean(accessToken && (status.isLoading || isToggling));
  const error =
    accessToken && status.isError
      ? getRequestErrorMessage(
          status.error,
          "즐겨찾기 상태를 불러오지 못했어요.",
        )
      : undefined;

  function handleClick() {
    if (!accessToken) {
      router.push("/login");
      return;
    }
    if (status.isError) {
      void status.refetch();
      return;
    }
    if (status.data && !disabled) {
      toggle.mutate(!isBookmarked, {
        onError: (failure) => {
          if (useAuthStore.getState().accessToken === accessToken) {
            window.alert(
              getRequestErrorMessage(failure, "즐겨찾기를 변경하지 못했어요."),
            );
          }
        },
      });
    }
  }

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-busy={disabled}
        title={error}
        aria-pressed={isBookmarked}
        className={cn(
          `
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            px-5
            py-3
            text-sm
            font-bold
            transition
            duration-200
            hover:-translate-y-0.5
            active:translate-y-0
            active:scale-[0.98]
          `,
          isBookmarked
            ? "bg-white text-zinc-950 shadow-lg"
            : "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
          "disabled:cursor-wait disabled:opacity-60",
          className,
        )}
      >
        <Image
          width={20}
          height={20}
          src={
            isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
          }
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
        />

        {error
          ? "북마크 상태 다시 확인"
          : isBookmarked
            ? "북마크 해제"
            : "북마크 추가"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-busy={disabled}
      title={error}
      aria-label={
        error
          ? "북마크 상태 다시 확인"
          : isBookmarked
            ? "북마크 해제"
            : "북마크 추가"
      }
      aria-pressed={isBookmarked}
      className={cn(
        `
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          backdrop-blur-md
          transition
          duration-200
          hover:scale-110
          active:scale-95
        `,
        isBookmarked
          ? "border-white/30 bg-white text-zinc-950 shadow-lg"
          : "border-white/20 bg-black/55 text-white shadow-md",
        className,
      )}
    >
      <Image
        width={20}
        height={20}
        src={
          isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"
        }
        alt=""
        aria-hidden="true"
        className="h-5 w-5 object-contain"
      />
    </button>
  );
}
