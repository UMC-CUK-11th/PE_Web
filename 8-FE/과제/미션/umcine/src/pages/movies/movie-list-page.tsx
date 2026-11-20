import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { RequestStatus } from "../../components/request-status";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];

  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 pt-8 pb-12 sm:px-10">
      <h1 className="mb-7 text-2xl font-bold">영화 목록</h1>
      {moviesQuery.isPending ? (
        <RequestStatus message="영화 목록을 불러오는 중이에요." />
      ) : moviesQuery.isError ? (
        <RequestStatus message="영화 목록을 불러오지 못했어요." tone="error" />
      ) : movies.length === 0 ? (
        <RequestStatus message="조건에 맞는 영화가 없어요." />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={page} onPageChange={setPage} />
        </>
      )}
    </main>
  );
}
