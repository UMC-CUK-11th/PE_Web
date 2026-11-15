import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const moviesWithBookmark = movies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#191919]">
      <main className="mx-auto min-h-[760px] w-[min(1210px,calc(100%-64px))] py-7 pb-[70px]">
        <h1 className="mb-[22px] text-[32px] leading-[1.2] font-bold">
          영화 목록
        </h1>

        {moviesQuery.isPending ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p>영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid
              movies={moviesWithBookmark}
              onToggleBookmark={toggleBookmark}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      <footer className="flex min-h-14 items-center justify-end border-t border-[#e5e7eb] bg-white px-[max(32px,calc((100%-1210px)/2))] text-[11px] text-[#8b9098]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}
