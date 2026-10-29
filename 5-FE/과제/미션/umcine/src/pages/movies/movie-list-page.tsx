import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestStatus } from "../../components/request-status";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
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
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pt-8 pb-12 sm:px-10">
      <h1 className="mb-7 text-2xl font-bold">영화 목록</h1>
      {isLoading ? (
        <RequestStatus message="영화 목록을 불러오는 중이에요." />
      ) : errorMessage ? (
        <RequestStatus message={errorMessage} tone="error" />
      ) : movies.length === 0 ? (
        <RequestStatus message="조건에 맞는 영화가 없어요." />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={currentPage} onPageChange={setCurrentPage} />
        </>
      )}
    </main>
  );
}
