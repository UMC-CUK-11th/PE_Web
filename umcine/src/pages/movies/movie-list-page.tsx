import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="mx-auto flex min-h-[1185px] w-full max-w-[1440px] flex-col gap-5 bg-[#f6f7f9] px-20 py-6 max-[1200px]:px-10 max-[768px]:min-h-0 max-[768px]:p-5">
      <h1 className="m-0 text-left text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191e] max-[768px]:text-[30px] max-[768px]:leading-[38px] max-[768px]:tracking-[-1px]">
        영화 목록
      </h1>

      <MovieGrid movies={initialMovies} />
      <Pagination
        currentPage={currentPage}
        totalPages={5}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
