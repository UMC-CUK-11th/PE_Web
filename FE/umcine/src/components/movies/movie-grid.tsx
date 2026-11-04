import { useState } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(readBookmarkIds);
  const moviesState = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkIds.includes(movie.id),
  }));
  function handleToggleBookmark(movieId: number) {
    const nextIds = bookmarkIds.includes(movieId)
      ? bookmarkIds.filter((id) => id !== movieId)
      : [...bookmarkIds, movieId];
    setBookmarkIds(nextIds);
    saveBookmarkIds(nextIds);
  }
  return (
    <ul className="mx-auto mt-6 grid grid-cols-[minmax(0,1fr)] min-[662px]:grid-cols-[repeat(2,241px)] min-[923px]:grid-cols-[repeat(3,241px)] min-[1184px]:grid-cols-[repeat(4,241px)] min-[1445px]:grid-cols-[repeat(5,241px)] justify-center justify-items-center gap-x-5 gap-y-[18px] p-0 list-none">
      {moviesState.map((movie) => (
        <li key={movie.id} className="relative">
          {/* 포스터 + 북마크 */}
          <div className="relative">
            {/* 포스터 이미지 */}
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : undefined
                }
                alt={movie.original_title}
                className="w-[241px] h-[274px] rounded-[10px] object-cover"
              />
            </Link>
            {/* 북마크 버튼 */}
            <button
              className={cn(
                "flex justify-center items-center w-[34px] h-[34px] top-3 right-2 border-none rounded-lg absolute",
                movie.isBookmarked ? "bg-[#2563eb]" : "bg-black/60",
              )}
              onClick={() => handleToggleBookmark(movie.id)}
              aria-label="Bookmark"
              aria-pressed={movie.isBookmarked}
            >
              <img
                src={
                  movie.isBookmarked
                    ? "/icons/movie-icons/bookmark.svg"
                    : "/icons/movie-icons/bookmark-outline.svg"
                }
                className="brightness-0 invert"
                alt=""
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex flex-col m-0 text-start">
            <Link
              to="/movies/$movieId"
              params={{ movieId: String(movie.id) }}
              className="no-underline pt-[5px] h-[27px] text-[14px] font-extrabold text-[#17191E]"
            >
              {movie.title}
            </Link>

            <p className="h-[14px] text-xs text-[#969DA8]">
              {movie.release_date}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
