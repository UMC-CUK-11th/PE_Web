import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  const [cardSize, setCardSize] = useState<"default" | "large">(() => {
    try {
      return localStorage.getItem("umcine-card-size") === "large" ? "large" : "default";
    } catch {
      return "default";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("umcine-card-size", cardSize);
    } catch {
      // 저장소를 사용할 수 없어도 현재 화면의 설정은 적용해요.
    }
  }, [cardSize]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">영화 목록</h1>
        <p className="text-sm text-slate-500">영화 {movies.length}편</p>
      </div>
      <label className="mb-5 flex items-center justify-end gap-3 text-sm text-slate-600">
        카드 크기
        <select
          value={cardSize}
          onChange={(event) => setCardSize(event.target.value === "large" ? "large" : "default")}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <option value="default">기본</option>
          <option value="large">크게</option>
        </select>
      </label>
      <MovieGrid movies={movies} cardSize={cardSize} />
      <Pagination />
    </main>
  );
}
import { useEffect, useState } from "react";
