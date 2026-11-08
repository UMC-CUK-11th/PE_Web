import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      try {
        const response = await getMovies();
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    void loadMovies();
    return () => { ignore = true; };
  }, []);

  return <main className="mx-auto w-full max-w-[1180px] px-6 py-6">
    <h1 className="mb-5 text-[25px] font-bold text-[#20232a]">영화 목록</h1>
    {isLoading ? <p role="status">영화 목록을 불러오는 중이에요.</p>
      : errorMessage ? <p role="alert">{errorMessage}</p>
      : movies.length === 0 ? <p>조건에 맞는 영화가 없어요.</p>
      : <MovieGrid movies={movies} />}
  </main>;
}
