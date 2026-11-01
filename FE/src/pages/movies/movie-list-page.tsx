import { useEffect, useState } from "react";

import MovieCard from "../../components/movies/movie-card";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

function MovieListPage() {
  const { bookmarkedMovieIds, toggleBookmark } = useBookmarkStore();

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p>영화 목록을 불러오는 중...</p>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p>{errorMessage}</p>
      </main>
    );
  }

  if (movies.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-8">
        <p>영화가 없습니다.</p>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold">공개 예정 영화</h1>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              releaseDate={movie.release_date}
              poster={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.png"
              }
              isBookmarked={bookmarkedMovieIds.includes(movie.id)}
              onToggleBookmark={() => toggleBookmark(movie.id)}
            />
          ))}
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        이 서비스는 TMDB API를 사용하며 TMDB의 공식 인증 또는 보증을 받은 서비스가 아닙니다
      </footer>
    </>
  );
}

export default MovieListPage;