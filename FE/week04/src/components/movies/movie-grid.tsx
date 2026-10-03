import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-5 gap-x-5 gap-y-7">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
