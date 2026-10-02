import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const initialBookmarks = Object.fromEntries(
  movies.map((movie) => [movie.id, movie.isBookmarked]),
);

export function MovieListPage() {
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>(initialBookmarks);
  const [currentPage, setCurrentPage] = useState(1);

  function handleBookmarkToggle(movieId: number) {
    setBookmarks((currentBookmarks) => ({
      ...currentBookmarks,
      [movieId]: !currentBookmarks[movieId],
    }));
  }

  return (
    <>
      <main className="mx-auto w-full max-w-[1120px] flex-1 bg-[#f6f7f9] px-6 pt-[18px] pb-[72px] md:px-12">
        <h1 className="mb-2 text-[22px] leading-[1.25] font-extrabold tracking-[-1.1px] text-[#1b1f27]">영화 목록</h1>
        <MovieGrid
          movies={movies}
          bookmarks={bookmarks}
          onBookmarkToggle={handleBookmarkToggle}
        />
        <Pagination currentPage={currentPage} pageCount={1} onPageChange={setCurrentPage} />
      </main>
      <footer className="flex min-h-9 items-center justify-center gap-2 border-t border-[#e7e9ed] bg-white px-6 text-center text-[10px] text-[#8a9099] md:justify-end md:px-12">
        <img className="w-[22px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </>
  );
}
