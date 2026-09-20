import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import type { Movie } from "./types/movie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <div className="app">
      <Header />

      <main className="main">
        <h1>영화 목록</h1>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />

        <Pagination />
      </main>

      <footer className="footer">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}

export default App;
