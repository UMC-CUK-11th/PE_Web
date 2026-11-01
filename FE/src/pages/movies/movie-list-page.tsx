import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { RequestState } from "../../components/movies/request-state";
import { getMovies } from "../../api/movies/get-movies";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { toMovieCard } from "../../utils/movies/movie-adapter";
import { getRequestErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const load = useCallback(() => getMovies({ page }), [page]);
  const { data, error, isLoading, retry } = useMovieRequest(`list:${page}`, load);
  const [cardSize, setCardSize] = useState<"default" | "large">(() => {
    try { return localStorage.getItem("umcine-card-size") === "large" ? "large" : "default"; }
    catch { return "default"; }
  });
  useEffect(() => {
    try { localStorage.setItem("umcine-card-size", cardSize); } catch { /* 저장 불가 시 화면 설정은 유지 */ }
  }, [cardSize]);
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">영화 목록</h1>
        {data && <p className="text-sm text-slate-500">영화 {data.total_results}편</p>}
      </div>
      <label className="mb-5 flex items-center justify-end gap-3 text-sm text-slate-600">
        카드 크기
        <select value={cardSize} onChange={(event) => setCardSize(event.target.value === "large" ? "large" : "default")} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
          <option value="default">기본</option><option value="large">크게</option>
        </select>
      </label>
      {isLoading ? <RequestState loading /> : error ? <RequestState error={getRequestErrorMessage(error)} onRetry={retry} />
        : data?.results.length ? <MovieGrid movies={data.results.map(toMovieCard)} cardSize={cardSize} /> : <RequestState />}
      {data && <Pagination page={page} totalPages={data.total_pages} onPageChange={(next) => navigate({ search: { page: next } })} />}
    </main>
  );
}
