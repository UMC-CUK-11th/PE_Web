import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListResponse } from "../../api/movies/models";
import RequestStatus from "../../components/movies/request-status";

import CardSizeControl from "../../components/movies/card-size-control";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 pt-8">
      <CardSizeControl />

      <MovieListResults
        key={currentPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

function MovieListResults({
  currentPage,
  onPageChange,
}: {
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const [data, setData] = useState<TmdbMovieListResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    getMovies({ page: currentPage, signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) setData(response);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setErrorMessage(
            error instanceof Error &&
              error.message === "TMDB 환경 변수가 필요해요."
              ? error.message
              : "영화 목록을 불러오지 못했어요.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [currentPage, attempt]);
  function retry() {
    setErrorMessage("");
    setIsLoading(true);
    setAttempt((value) => value + 1);
  }
  if (isLoading || errorMessage)
    return (
      <RequestStatus loading={isLoading} error={errorMessage} onRetry={retry} />
    );
  if (!data?.results.length)
    return (
      <p role="status" className="p-10 text-center">
        표시할 영화가 없어요.
      </p>
    );
  return (
    <>
      <MovieGrid movies={data.results} />
      <Pagination
        currentPage={data.page}
        totalPages={data.total_pages}
        onPageChange={onPageChange}
      />
    </>
  );
}
