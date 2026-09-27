import { useState } from "react";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import { movies } from "./data/movies";
import "./App.css";

const initialBookmarks = Object.fromEntries(
  movies.map((movie) => [movie.id, movie.isBookmarked]),
);

export default function App() {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>(initialBookmarks);
  const [currentPage, setCurrentPage] = useState(1);

  function handleBookmarkToggle(movieId: number) {
    setBookmarks((currentBookmarks) => ({
      ...currentBookmarks,
      [movieId]: !currentBookmarks[movieId],
    }));
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="movie-list-page">
        <h1>영화 목록</h1>
        <MovieGrid
          movies={movies}
          bookmarks={bookmarks}
          onBookmarkToggle={handleBookmarkToggle}
        />
        <Pagination currentPage={currentPage} pageCount={1} onPageChange={setCurrentPage} />
      </main>
      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
