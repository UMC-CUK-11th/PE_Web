// URL의 검색어를 읽어 영화 검색 결과를 표시한다.
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query?.trim() ?? "";
  // 검색어가 있을 때만 요청하고 검색어별로 결과를 저장한다.
  const searchQuery = useQuery({
    queryKey: ["movies", "search", normalizedQuery],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const movies = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;
  const isLoading = searchQuery.isLoading;
  const errorMessage = searchQuery.isError
    ? "검색 결과를 불러오지 못했어요."
    : null;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = String(new FormData(event.currentTarget).get("query") ?? "").trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 검색</h1>
      <form key={query ?? ""} onSubmit={handleSubmit} className="mb-10 flex gap-2">
        <label className="sr-only" htmlFor="movie-query">검색어</label>
        <input id="movie-query" name="query" defaultValue={query ?? ""} placeholder="영화 제목 또는 원제를 입력하세요" className="min-w-0 flex-1 rounded border border-gray-700 bg-[#1f2128] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-[#e50914]" />
        <button type="submit" className="rounded bg-[#e50914] px-5 py-3 font-bold hover:bg-red-700">검색</button>
      </form>
      {!normalizedQuery ? (
        <p role="status" className="py-10 text-center text-gray-400">검색어를 입력해 주세요.</p>
      ) : isLoading ? (
        <p role="status" className="py-10 text-center text-gray-400">검색 결과를 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p role="alert" className="py-10 text-center text-red-400">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p role="status" className="py-10 text-center text-gray-400">검색 결과가 없어요.</p>
      ) : (
        <>
          <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
          <p className="mt-2 text-gray-400">영화 {totalResults}편 중 {movies.length}편 표시</p>
          <ul className="mt-6 grid gap-4">
            {movies.map((movie) => {
              const posterUrl = getTmdbPosterUrl(movie.poster_path);
              return (
                <li key={movie.id} className="flex gap-4 rounded-lg bg-[#1f2128] p-4">
                  <div className="relative h-36 w-24 shrink-0">
                    {posterUrl ? (
                      <img src={posterUrl} alt={`${movie.title} 포스터`} className="h-full w-full rounded object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded bg-gray-700 text-sm text-gray-300">이미지 없음</div>
                    )}
                    <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="absolute right-1 top-1" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-lg font-bold">
                      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="hover:text-[#e50914]">{movie.title}</Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">{movie.original_title} · {movie.release_date || "개봉일 정보 없음"}</p>
                    <p className="mt-3 line-clamp-2 text-sm text-gray-300">{movie.overview || "줄거리 정보가 없어요."}</p>
                    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto pt-3 text-sm font-bold text-[#e50914]">상세 보기</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
