import { useCallback, useState, type SubmitEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { searchMovies } from "../../api/movies/search-movies";
import { useMovieRequest } from "../../hooks/use-movie-request";
import { toMovieCard } from "../../utils/movies/movie-adapter";
import { getRequestErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import BookmarkButton from "../../components/movies/bookmark-button";
import Pagination from "../../components/movies/pagination";
import { MovieImage } from "../../components/movies/movie-image";
import { RequestState } from "../../components/movies/request-state";

function SearchForm({ query, onSearch }: { query: string; onSearch: (query: string) => void }) {
  const [text, setText] = useState(query);
  function submit(event: SubmitEvent<HTMLFormElement>) { event.preventDefault(); onSearch(text.trim()); }
  return <form onSubmit={submit} role="search" className="mt-8 mb-10 flex gap-3">
    <input aria-label="검색어" placeholder="예: 스파이더맨, 인셉션" value={text} onChange={(event) => setText(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3" />
    <button type="submit" className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">검색</button>
  </form>;
}
export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query.trim();
  const load = useCallback(() => searchMovies({ query: normalizedQuery, page }), [normalizedQuery, page]);
  const { data, error, isLoading, retry } = useMovieRequest(`search:${normalizedQuery}:${page}`, load, Boolean(normalizedQuery));
  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
    <h1 className="text-3xl font-bold">영화 검색</h1>
    <p className="mt-3 text-slate-600">영화 제목이나 원제로 검색해 보세요.</p>
    <SearchForm key={query} query={query} onSearch={(next) => navigate({ search: next ? { query: next, page: 1 } : {} })} />
    {!normalizedQuery ? <p role="status" className="py-16 text-center text-slate-500">검색어를 입력해 주세요.</p>
      : isLoading ? <RequestState loading /> : error ? <RequestState error={getRequestErrorMessage(error)} onRetry={retry} />
      : <>
        <h2 className="text-xl font-bold break-words">‘{query}’ 검색 결과</h2>
        <p role="status" className="mt-2 mb-6 text-sm text-slate-500">영화 {data?.total_results ?? 0}편</p>
        {!data?.results.length ? <RequestState /> : <ul className="space-y-5">
          {data.results.map(toMovieCard).map((movie) => <li key={movie.id} className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:gap-7">
            <div className="relative w-36 shrink-0 self-start">
              <MovieImage src={movie.posterPath} alt={`${movie.title} 포스터`} className="aspect-[2/3] w-full rounded-lg object-cover" />
              <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
            </div>
            <div className="min-w-0 py-1">
              <h3 className="text-xl font-bold">{movie.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{movie.originalTitle}</p>
              <p className="mt-3 text-sm text-slate-500">{movie.releaseDate}</p>
              <p className="mt-3 leading-7 text-slate-600">{movie.overview || "줄거리 정보가 없어요."}</p>
              <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-4 inline-block rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">상세 보기</Link>
            </div>
          </li>)}
        </ul>}
        {data && <Pagination page={page} totalPages={data.total_pages} onPageChange={(next) => navigate({ search: { query, page: next } })} />}
      </>}
  </main>;
}
