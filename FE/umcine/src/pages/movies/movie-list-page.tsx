import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });
  const movies = moviesQuery.data?.results ?? [];
  return <main className="mx-auto w-full max-w-[1180px] px-6 py-6">
    <h1 className="mb-5 text-[25px] font-bold text-[#20232a]">영화 목록</h1>
    {moviesQuery.isPending ? <p role="status">영화 목록을 불러오는 중이에요.</p>
      : moviesQuery.isError ? <p role="alert">영화 목록을 불러오지 못했어요.</p>
      : movies.length === 0 ? <p>조건에 맞는 영화가 없어요.</p>
      : <><MovieGrid movies={movies} />
        <Pagination currentPage={page} totalPages={moviesQuery.data?.total_pages ?? 0} onPageChange={setPage} />
      </>}
  </main>;
}
