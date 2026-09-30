import { useState } from "react";

import CardSizeControl from "../../components/movies/card-size-control";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movie";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 pt-8">
      <CardSizeControl />

      <MovieGrid movies={movies} />

      <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
    </main>
  );
}
