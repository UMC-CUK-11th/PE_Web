import { useState } from "react";
import type { Movie } from "../../types/movie";
import { movies as initialMovies } from "../../data/movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) => currentMovies.map((movie) => movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie));
  }
  return <main className="mx-auto max-w-[1200px] px-5 py-8"><h1 className="mb-6 text-2xl font-bold">영화 목록</h1><MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} /><Pagination currentPage={currentPage} onPageChange={setCurrentPage} /><footer className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-gray-400"><img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-6 w-auto" /><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></footer></main>;
}
