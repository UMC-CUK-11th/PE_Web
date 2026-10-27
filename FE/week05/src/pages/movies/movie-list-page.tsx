import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { SiteFooter } from "../../components/layout/site-footer";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } catch {
        if (!ignore) {
          setMovies([]);
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

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
          {isLoading ? (
            <p className="rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]" role="status">
              영화 목록을 불러오는 중이에요.
            </p>
          ) : errorMessage ? (
            <p className="rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]" role="alert">
              {errorMessage}
            </p>
          ) : movies.length === 0 ? (
            <p className="rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]">
              조건에 맞는 영화가 없어요.
            </p>
          ) : (
            <>
              <MovieGrid movies={movies} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
