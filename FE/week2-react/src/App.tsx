import { useState } from "react";
import "./App.css";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import { movies as initialMovies } from "./data/movies";

export default function App() {
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
    <div className="app-shell" id="top">
      <Header />
      <main className="movie-page">
        <section className="movie-list" aria-labelledby="movie-list-title">
          <h1 id="movie-list-title">영화 목록</h1>
          <MovieGrid
            movies={movies}
            onToggleBookmark={handleToggleBookmark}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </div>
  );
}
