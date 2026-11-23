import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import { SiteFooter } from "../../components/layout/site-footer";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";

export function MovieListPage() {
  // 사용자가 현재 보고 있는 페이지 번호는 화면에서 직접 관리해요.
  const [currentPage, setCurrentPage] = useState(1);

  // 영화 요청과 그 결과·로딩·오류 상태는 useQuery가 관리해요.
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: currentPage }],
    queryFn: () => getMovies({ page: currentPage }),
  });

  // 응답이 아직 없으면 영화 목록은 [], 전체 페이지 수는 0으로 취급해요.
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = moviesQuery.data?.total_pages ?? 0;

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

          {moviesQuery.isPending ? (
            <p
              className="rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]"
              role="status"
            >
              영화 목록을 불러오는 중이에요.
            </p>
          ) : moviesQuery.isError ? (
            <p
              className="rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]"
              role="alert"
            >
              영화 목록을 불러오지 못했어요.
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