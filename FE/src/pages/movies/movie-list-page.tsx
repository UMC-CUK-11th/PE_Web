// 이 파일은 / 화면의 내용을 구성하는 페이지 컴포넌트다.
// URL 연결은 routes/index.tsx에 맡기고, 여기서는 영화 목록·페이지 번호·출처를 표시한다.
import { useState } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  // 워크북 요구에 맞춰 영화 10개는 모두 유지하고, 현재 페이지 표시만 바꾼다.
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>

      <MovieGrid movies={movies} />
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* 제공된 영화 자료의 출처와 고지 문구를 목록 화면에서 보여준다. */}
      <footer className="mt-8 flex flex-col items-center gap-2 text-center text-sm text-gray-400">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB"
          className="h-6 w-auto"
        />
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </main>
  );
}
