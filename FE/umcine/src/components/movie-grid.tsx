import type { Movie } from "../types/movie";
import type { CardSize } from "../stores/display-preferences-store";
import { cn } from "../utils/cn";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  cardSize?: CardSize;
}

export function MovieGrid({ movies, cardSize = "comfortable" }: MovieGridProps) {
  return (
    <section
      className={cn(
        "grid gap-x-3 gap-y-7 md:gap-x-4",
        cardSize === "comfortable" && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
        cardSize === "compact" && "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6",
      )}
      id="movies"
      aria-label="영화 목록"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
