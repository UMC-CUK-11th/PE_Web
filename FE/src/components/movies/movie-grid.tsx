import MovieCard from "./movie-card";
import type { Movie } from "../../types/movie";

type MovieGridProps = {
  movies: Movie[];
  bookmarkedIds: number[];
  onToggleBookmark: (id: number) => void;
};

function MovieGrid({
  movies,
  bookmarkedIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          poster={movie.posterPath}
          isBookmarked={bookmarkedIds.includes(movie.id)}
          onToggleBookmark={() => onToggleBookmark(movie.id)}
        />
      ))}
    </div>
  );
}

export default MovieGrid;