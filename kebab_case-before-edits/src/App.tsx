import Header from "./components/header";
import MovieGrid from "./components/moive-grid";
import Pagination from "./components/pagination";
import { useState } from "react";
import { movies as initialMovies } from "./data/movie";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  
  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
  currentMovies.map((movie) => {
    if (movie.id === movieId) {
      return {
        ...movie,
        isBookmarked: !movie.isBookmarked,
      };
    }

    return movie;
  })
);
  }
  return (
    <>

    <Header />
      <main>
        <h1 className="page-title">영화 목록</h1>

        <MovieGrid 
        movies={ movies }
        onToggleBookmark = {handleToggleBookmark}
        />
      </main>

      <Pagination/>
    </>
  )
}
