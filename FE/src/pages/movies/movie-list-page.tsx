import { useState } from "react";
import { movies } from "../../data/movie";
import MovieCard from "../../components/movies/movie-card";

function MovieListPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
    movies
      .filter((movie) => movie.isBookmarked)
      .map((movie) => movie.id)
  );

  const handleToggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id)
        ? prev.filter((movieId) => movieId !== id)
        : [...prev, id]
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">공개 예정 영화</h1>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            releaseDate={movie.releaseDate}
            poster={movie.posterPath}
            isBookmarked={bookmarkedIds.includes(movie.id)}
            onToggleBookmark={() => handleToggleBookmark(movie.id)}
          />
        ))}
      </div>
    </main>
  );
}

export default MovieListPage;