import { useState } from "react";
import { SiteFooter } from "../../components/layout/site-footer";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [movies, setMovies] = useState(() =>
    initialMovies.map((movie) => ({ ...movie })),
  );
  const [currentPage, setCurrentPage] = useState(1);

  const handleToggleBookmark = (movieId: number) => {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <>
      <main className="min-h-[calc(100vh-132px)]">
        <section
          className="mx-auto w-[min(calc(100%-80px),1200px)] pt-[42px] pb-10"
          aria-labelledby="movie-list-title"
        >
          <h1
            className="mt-0 mb-6 text-[28px] leading-tight font-bold tracking-[-1px] text-[#181a20]"
            id="movie-list-title"
          >
            영화 목록
          </h1>
          <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
