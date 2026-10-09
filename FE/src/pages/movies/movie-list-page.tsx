import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">영화 목록</h1>
        <MovieGrid movies={movies} />

        <Pagination />
      </main>
    </>
  );
}
