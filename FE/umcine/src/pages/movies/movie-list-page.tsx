import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { MovieGrid } from "../../components/movies/movie-grid.tsx";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
    staleTime: 30 * 1000,
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    if (Number.isInteger(nextPage) && nextPage >= 1 && nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  return (
    <main>
      <section className="py-6 px-20 bg-[#f6f7f9]">
        <h2 className="h-11 p-0 text-left text-[38px] font-bold">영화 목록</h2>
        {moviesQuery.isPending ? (
          <p role="status">영화를 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p role="alert">{moviesQuery.error.message}</p>
        ) : movies.length === 0 ? (
          <p>표시할 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  );
}
