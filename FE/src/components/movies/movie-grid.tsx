import type { MovieCardModel } from "../../utils/movies/movie-adapter";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: MovieCardModel[];
  cardSize?: "default" | "large";
}

export default function MovieGrid({ movies, cardSize = "default" }: MovieGridProps) {
  return (
    <section aria-label="영화 목록" className="movie-grid" data-card-size={cardSize}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
