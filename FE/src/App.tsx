import { useState } from "react";

import Header from "./components/layout/header";
import MovieGrid from "./components/movies/movie-grid";


import { movies } from "./data/movie";

import "./App.css";

function App() {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
    movies
      .filter((movie) => movie.isBookmarked)
      .map((movie) => movie.id)
  );

  function handleToggleBookmark(movieId: number) {
    setBookmarkedIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  }

  return (
    <>
      <Header />

      <main className="main">
        <h1>영화 목록</h1>

        <MovieGrid
          movies={movies}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        
      </main>
    </>
  );
}

export default App;