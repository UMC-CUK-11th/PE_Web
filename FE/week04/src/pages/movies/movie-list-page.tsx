import { useState } from "react";
import { SiteFooter } from "../../components/layout/site-footer";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <main className="min-h-[calc(100vh-132px)]">
        <section
          className="mx-auto w-[min(calc(100%-80px),1200px)] pt-[42px] pb-10"
          aria-labelledby="movie-list-title"
        >
          <h1
            className="mt-0 mb-6 text-[28px] leading-tight font-bold tracking-[-1px] text-[#181a20]"
            id="movie-list-title"
          >
            영화 목록
          </h1>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
