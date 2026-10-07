import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Movie } from "../types/movie";
import { cn } from "../utils/cn";

interface MovieCardProps {
  movie: Movie;
}

const iconPath = "/icons/movie-icons/movie-icons";

export function MovieCard({ movie }: MovieCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[4px] bg-[#dedfe3] shadow-[0_3px_12px_rgba(23,24,28,0.08)]">
        <Link
          className="block h-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 정보 보기`}
        >
          <img
            className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>
        <button
          className={cn(
            "absolute right-2 top-2 grid size-7 cursor-pointer place-items-center rounded-[3px] border border-white/50 bg-black/75 transition hover:bg-black",
            isBookmarked && "border-[#2563eb] bg-[#2563eb] hover:bg-[#1d4ed8]",
          )}
          type="button"
          aria-label={`${movie.title} ${isBookmarked ? '북마크 해제' : '북마크 추가'}`}
          aria-pressed={isBookmarked}
          onClick={() => setIsBookmarked((current) => !current)}
        >
          <img
            className="size-4 invert"
            src={`${iconPath}/${isBookmarked ? "bookmark.svg" : "bookmark-outline.svg"}`}
            alt=""
          />
        </button>
      </div>

      <div className="pt-2.5">
        <h2 className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-bold tracking-[-0.35px]">
          <Link className="text-inherit no-underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
            {movie.title}
          </Link>
        </h2>
        <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[10px] text-[#8b8e96]">
          {movie.originalTitle}
        </p>
        <p className="mt-1 flex gap-1 overflow-hidden whitespace-nowrap text-[10px] text-[#696c73]">
          <span>{movie.releaseDate}</span>
          <span aria-hidden="true">·</span>
          <span className="overflow-hidden text-ellipsis">{movie.genres.join(" · ")}</span>
        </p>
      </div>
    </article>
  );
}
