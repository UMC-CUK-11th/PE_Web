import { useState } from "react";
import "./App.css";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import { movies } from "./data/movie";

const initialBookmarks = movies.filter((movie) => movie.isBookmarked).map((movie) => movie.id);

export default function App() {
  const [bookmarkedMovieIds, setBookmarkedMovieIds] = useState<number[]>(initialBookmarks);
  const [currentPage, setCurrentPage] = useState(1);

  const handleBookmarkToggle = (movieId: number) => {
    setBookmarkedMovieIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  };

  return (
    <div className="app-shell" id="top">
      <Header />
      <main className="movie-page">
        <div className="movie-page__content">
          <h1>영화 목록</h1>
          <MovieGrid
            movies={movies}
            bookmarkedMovieIds={bookmarkedMovieIds}
            onBookmarkToggle={handleBookmarkToggle}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
      <footer className="site-footer">
        <div className="site-footer__content">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>This product uses the TMDB API but is not endorsed or certified by</span>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB.</a>
        </div>
      </footer>
    </div>
  );
}
