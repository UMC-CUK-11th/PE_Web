import { MovieGrid } from "../../components/movie-grid";
import { movies } from "../../data/movie";

export function MovieListPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-112px)] w-full max-w-[1264px] px-4 py-8 md:px-8 md:py-10" id="top">
      <div className="mb-6">
        <h1 className="text-[22px] font-extrabold tracking-[-0.7px] md:text-2xl">영화 목록</h1>
      </div>
      <MovieGrid movies={movies} />
    </main>
  );
}
