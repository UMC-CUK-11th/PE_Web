import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

//4주차 코드 추가
import { readBookmarkIds, saveBookmarkIds } from "../../utils/bookmark-storage";

export function MovieListPage() {
  // 로컬 영화 데이터를 초기값으로 영화 목록 상태를 만든다.
  //4주차 코드 추가
  // 저장된 북마크를 영화 목록의 초기 상태에 반영한다.
  const [movies, setMovies] = useState(() => {
    const bookmarkedMovieIds = readBookmarkIds();

    return initialMovies.map((movie) => ({
      ...movie,
      isBookmarked: bookmarkedMovieIds.includes(movie.id),
    }));
  });

  function handleToggleBookmark(movieId: number) {
    //4주차 변경 코드
    const nextMovies = movies.map((movie) =>
      movie.id === movieId
        ? {
          ...movie,
          isBookmarked: !movie.isBookmarked,
        }
      : movie,
    );

    setMovies(nextMovies);

    const bookmarkedMovieIds = nextMovies
      .filter((movie)=>movie.isBookmarked)
      .map((movie)=>movie.id);

    saveBookmarkIds(bookmarkedMovieIds);
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
