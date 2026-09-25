import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

export default function App() {
  // 필수: 영화 10편을 표시하고 선택한 영화의 북마크만 변경한다.
  const [movies, setMovies] = useState(initialMovies);
  // 선택: 1~5 중 선택한 페이지 번호에만 활성 스타일을 적용한다.
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) => currentMovies.map((movie) =>
      movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
    ));
  }

  return (
    <>
      <Header />
      <main className="movie-page">
        <div className="container">
          <h1>영화 목록</h1>
          <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
          <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </main>
      <footer className="site-footer">
        <div className="container attribution">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </footer>
    </>
  );
}
