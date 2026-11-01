import { useState } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { Pagination } from "./pagination";
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function MovieGrid({ movies, isLoading, errorMessage }: MovieGridProps) {
  const [bookmarkIds, setBookmarkIds] = useState<number[]>(readBookmarkIds);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesState = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkIds.includes(movie.id),
  }));
  const moviesPerPage = 10;
  const totalPages = Math.ceil(moviesState.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = moviesState.slice(
    startIndex,
    startIndex + moviesPerPage,
  );
  function handleToggleBookmark(movieId: number) {
    const nextIds = bookmarkIds.includes(movieId)
      ? bookmarkIds.filter((id) => id !== movieId)
      : [...bookmarkIds, movieId];
    setBookmarkIds(nextIds);
    saveBookmarkIds(nextIds);
  }
  return (
    <section className="py-6 px-20 bg-[#f6f7f9] ">
      <h2 className="h-11 p-0 text-left text-[38px] font-bold">영화 목록</h2>
      {isLoading ? (
        <p role="status">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert">{errorMessage}</p>
      ) : moviesState.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <ul className="mx-auto mt-6 grid grid-cols-[minmax(0,1fr)] min-[662px]:grid-cols-[repeat(2,241px)] min-[923px]:grid-cols-[repeat(3,241px)] min-[1184px]:grid-cols-[repeat(4,241px)] min-[1445px]:grid-cols-[repeat(5,241px)] justify-center justify-items-center gap-x-5 gap-y-[18px] p-0 list-none">
            {" "}
            {currentMovies.map((movie) => (
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}
