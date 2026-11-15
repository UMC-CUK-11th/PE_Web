import type { TmdbMovie } from "../../api/movies/models";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovie[];
  showBookmarkButton?: boolean;
}

export function MovieGrid({ movies, showBookmarkButton }: MovieGridProps) {
  return (
    <section id="movie-list" className="grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 md:grid-cols-5 md:gap-x-4" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} showBookmarkButton={showBookmarkButton} />
      ))}
    </section>
  );
}
