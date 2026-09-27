import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movie";


export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 pt-8">
      <MovieGrid
        movies={movies}
        onToggleBookmark={handleToggleBookmark}
      />

      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}