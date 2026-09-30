import type { Movie } from "../../types/movie";
import { useUiPreferenceStore } from "../../stores/ui-preference-store";
import { cn } from "../../utils/cn";

import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  const cardSize = useUiPreferenceStore((state) => state.cardSize);

  return (
    <section
      className={cn(
        `
          mx-auto
          grid
          w-full
          max-w-6xl
          gap-6
          px-5
          lg:px-8
        `,
        cardSize === "comfortable"
          ? `
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
            `
          : `
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
            `,
      )}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
