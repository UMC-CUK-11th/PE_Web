import type { Movie } from "../types/movie";
import type { MovieCardSize } from "../stores/view-preference-store";
import { cn } from "../utils/cn";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  cardSize: MovieCardSize;
}

export function MovieGrid({ movies, cardSize }: MovieGridProps) {
  return (
    <section
      className={cn(
        "grid gap-x-4 gap-y-[25px]",
        cardSize === "compact"
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      )}
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
