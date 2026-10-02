import { useState } from "react";
import { MovieGrid } from "../components/movie-grid";
import { Pagination } from "../components/pagination";
import { movies } from "../data/movie";

interface MovieListPageProps {
  bookmarkedMovieIds: number[];
  onBookmarkToggle: (movieId: number) => void;
}

export function MovieListPage({ bookmarkedMovieIds, onBookmarkToggle }: MovieListPageProps) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),1200px)] py-[31px] pb-[92px] max-[420px]:w-[calc(100%-32px)]">
        <h1 className="mb-[21px] text-[34px] font-extrabold leading-[1.2] tracking-[-1.7px] max-sm:text-[28px]">영화 목록</h1>
        <MovieGrid
          movies={movies}
          bookmarkedMovieIds={bookmarkedMovieIds}
          onBookmarkToggle={onBookmarkToggle}
        />
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </div>
    </main>
  );
}
