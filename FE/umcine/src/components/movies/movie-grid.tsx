import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieGrid({
  movies,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <section
      className="
        mx-auto
        grid
        w-full
        max-w-7xl
        grid-cols-1
        gap-x-5
        gap-y-10
        px-5
        sm:grid-cols-2
        min-[700px]:grid-cols-3
        lg:px-8
      "
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}