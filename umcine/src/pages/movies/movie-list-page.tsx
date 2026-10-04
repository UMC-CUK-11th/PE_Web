import { useState } from 'react';
import { MovieGrid } from '../../components/movies/movie-grid';
import { Pagination } from '../../components/movies/pagination';
import { movies, useBookmarks } from '../../data/movies';

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const { bookmarkedIds, toggleBookmark } = useBookmarks();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className='mx-auto w-full max-w-[1200px] px-6 pb-16 pt-8'>
      <h2 className='mb-5 mt-0 text-[22px] font-bold text-gray-900'>
        영화 목록
      </h2>

      <MovieGrid
        movies={movies}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
