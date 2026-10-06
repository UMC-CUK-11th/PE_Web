import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
  // 로컬 영화 데이터를 초기값으로 영화 목록 상태를 만든다.
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    // 현재 배열을 직접 수정하지 않고 map으로 새로운 배열을 만든다.
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1180px] px-6 py-6">
      <h1 className="mb-5 text-[25px] font-bold text-[#20232a]">영화 목록</h1>

      <MovieGrid
        movies={movies}
        onToggleBookmark={handleToggleBookmark}
      />

      <Pagination />
    </main>
  );
}
