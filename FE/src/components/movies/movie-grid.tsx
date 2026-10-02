import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <section className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:gap-x-4 lg:grid-cols-5" id="movies" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
      ))}
    </section>
  );
}