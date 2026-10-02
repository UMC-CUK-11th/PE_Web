import { useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  function toggleBookmark(id: number) {
    setMovies((current) =>
      current.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pt-8 pb-12 sm:px-10">
      <h1 className="mb-7 text-2xl font-bold">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}
