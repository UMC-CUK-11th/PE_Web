import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Footer from "./components/footer";
import { movies as initialMovies } from "./data/movies";
import Pagination from "./components/pagination";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="movie-list-page">
      <Header />

      <main className="movie-page">
        <h1 className="movie-page-title">영화 목록</h1>

        <MovieGrid
          movies={movies}
          onToggleBookmark={handleToggleBookmark}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />
    </div>
  );
}
