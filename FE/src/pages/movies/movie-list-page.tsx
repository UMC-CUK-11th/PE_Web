// 워크북처럼 useEffect 안에서 요청의 시작·완료 상태를 관리한다.
import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { env } from "../../config/env";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);
      setMovies([]);
      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(response.total_pages);
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadMovies();
    // 이전 페이지의 느린 응답이 현재 화면을 덮어쓰지 않게 한다.
    return () => { ignore = true; };
  }, [currentPage]);

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>
      {isLoading ? (
        <p role="status" className="py-10 text-center text-gray-400">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <div role="alert" className="py-10 text-center text-red-400">
          <p>{errorMessage}</p>
          {(!env.tmdbApiBaseUrl || !env.tmdbAccessToken) && (
            <p className="mt-2 text-sm text-gray-400">FE/.env.local에 TMDB 환경 변수를 설정하고 개발 서버를 다시 시작해 주세요.</p>
          )}
        </div>
      ) : movies.length === 0 ? (
        <p role="status" className="py-10 text-center text-gray-400">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination currentPage={currentPage} totalPages={Math.min(totalPages, 500)} onPageChange={setCurrentPage} />
        </>
      )}
      <footer className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-gray-400">
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" aria-label="TMDB 홈페이지">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-6 w-auto" />
        </a>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </main>
  );
}
