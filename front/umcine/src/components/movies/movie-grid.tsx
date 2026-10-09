import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section id="movie-list" className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 md:grid-cols-5 md:gap-x-4" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
