import type { Movie } from '../../types/movie';
import { MovieCard } from './movie-card';

interface MovieGridProps {
  movies: Movie[];
  bookmarkedIds: Set<number>;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieGrid({
  movies,
  bookmarkedIds,
  onToggleBookmark,
}: MovieGridProps) {
  return (
    <div
      className='
        grid grid-cols-1 gap-6
        min-[481px]:grid-cols-2
        min-[721px]:grid-cols-3
        min-[1025px]:grid-cols-5
      '
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isBookmarked={bookmarkedIds.has(movie.id)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
}
