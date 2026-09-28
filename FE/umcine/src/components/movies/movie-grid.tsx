import { movies } from "../../data/movies";
import { useState } from "react";
import type { Movie } from "../../types/movie";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { Pagination } from "./pagination";

export function MovieGrid() {
  const [moviesState, setBookmark] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 10;
  const totalPages = Math.ceil(moviesState.length / moviesPerPage);
  const startIndex = (currentPage - 1) * moviesPerPage;
  const currentMovies = moviesState.slice(
    startIndex,
    startIndex + moviesPerPage,
  );
  function handleToggleBookmark(movieId: number) {
    setBookmark((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }
  return (
    <section className="py-6 px-20 bg-[#f6f7f9] ">
      <h2 className="h-11 p-0 text-left text-[38px] font-bold">영화 목록</h2>
      {moviesState.length == 0 ? (
        <p>표시할 영화가 없습니다.</p>
      ) : (
        <>
          <ul className=" grid grid-cols-[241px] mt-6 min-sm:grid-cols-[repeat(2,241px)] min-md:grid-cols-[repeat(3,241px)] min-lg:grid-cols-[repeat(4,241px)] min-xl:grid-cols-[repeat(5,241px)] gap-x-5 gap-y-[18px] mx-auto p-0 list-none justify-center content-center ">
            {currentMovies.map((movie: Movie) => (
              <li key={movie.id} className="relative">
                {/* 포스터 + 북마크 */}
                <div className="relative">
                  {/* 포스터 이미지 */}
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                  >
                    <img
                      src={movie.posterPath}
                      alt={movie.originalTitle}
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
                    {movie.releaseDate}
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
