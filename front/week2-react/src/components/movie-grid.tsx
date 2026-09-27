import type { Movie } from "../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  bookmarks: Record<number, boolean>;
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieGrid({ movies, bookmarks, onBookmarkToggle }: MovieGridProps) {
  return (
    <section id="movie-list" className="movie-grid" aria-label="영화 목록">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarks[movie.id]}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </section>
  );
}
