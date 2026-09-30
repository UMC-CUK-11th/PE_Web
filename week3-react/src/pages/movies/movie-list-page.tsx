import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import type { Movie } from "../../types/movie";

export function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const handleToggleBookmark = (id: number) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#191919]">
      <main className="mx-auto min-h-[760px] w-[min(1210px,calc(100%-64px))] py-7 pb-[70px]">
        <h1 className="mb-[22px] text-[32px] leading-[1.2] font-bold">
          영화 목록
        </h1>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />

        <Pagination />
      </main>

      <footer className="flex min-h-14 items-center justify-end border-t border-[#e5e7eb] bg-white px-[max(32px,calc((100%-1210px)/2))] text-[11px] text-[#8b9098]">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}
