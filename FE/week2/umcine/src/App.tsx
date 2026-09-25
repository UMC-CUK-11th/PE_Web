import { useState } from "react";
import "./App.css";
import { movies as initialMovies } from "./data/movies";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import type { Movie } from "./types/movie";

const MOVIES_PER_PAGE = 10;

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));
  const firstMovieIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const visibleMovies = movies.slice(
    firstMovieIndex,
    firstMovieIndex + MOVIES_PER_PAGE
  );

  const handleToggleBookmark = (movieId: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <div className="app-container">
      <Header />

      <main id="movies" className="main-content">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid
          movies={visibleMovies}
          onToggleBookmark={handleToggleBookmark}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>

      {/* 하단 API 저작권 명시 영역 */}
      <footer className="footer">
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </div>

  );
}