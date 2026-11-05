import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isPending, isError } = useQuery({
    queryKey: ["movies", "popular", currentPage],
    queryFn: () => getMovies({ page: currentPage }),
    retry: false,
  });
  const movies = data?.results ?? [];
  const pageCount = Math.max(1, data?.total_pages ?? 1);

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <>
      <main className="mx-auto w-full max-w-[1120px] flex-1 bg-[#f6f7f9] px-6 pt-[18px] pb-[72px] md:px-12">
        <h1 className="mb-2 text-[22px] leading-[1.25] font-extrabold tracking-[-1.1px] text-[#1b1f27]">영화 목록</h1>
        {isPending ? (
          <p role="status" className="py-12 text-center text-sm text-[#747b86]">영화 목록을 불러오는 중이에요.</p>
        ) : isError ? (
          <p role="alert" className="py-12 text-center text-sm text-[#747b86]">영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p className="py-12 text-center text-sm text-[#747b86]">표시할 영화가 없어요.</p>
        ) : (
          <MovieGrid movies={movies} />
        )}
        {!isPending && !isError && (
          <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={handlePageChange} />
        )}
      </main>
      <TmdbFooter />
    </>
  );
}
