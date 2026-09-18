import { useState } from "react";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

import { movies as initialMovies } from "./data/movie";
import type { Movie } from "./types/movie";

import "./App.css";

export default function App() {
  const [movies, setMovies] =
    useState<Movie[]>(initialMovies);

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

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="page-heading">
          <h2>영화 목록</h2>
          <p>
            지금 상영 중이거나 개봉 예정인 영화를
            확인해보세요.
          </p>
        </section>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}