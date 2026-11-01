import { useEffect, useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });

        if (!ignore) {
          setMovies(response.results);
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

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

        {isLoading ? (
          <p>영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid
              movies={moviesWithBookmark}
              onToggleBookmark={toggleBookmark}
            />
            <Pagination />
          </>
        )}
      </main>

      <footer className="flex min-h-14 items-center justify-end border-t border-[#e5e7eb] bg-white px-[max(32px,calc((100%-1210px)/2))] text-[11px] text-[#8b9098]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}
