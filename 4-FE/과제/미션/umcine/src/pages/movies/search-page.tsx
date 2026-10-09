import { BookmarkButton } from "../../components/bookmark-button";
import { useEffect, useState, type SubmitEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);
  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const results = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    void navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }
  return (
    <main className="mx-auto w-full max-w-[1360px] px-5 py-8 sm:px-10">
      <h1 className="mb-7 text-2xl font-bold">영화 검색</h1>
      <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
        <input
          aria-label="검색어"
          placeholder="영화 제목을 검색해 보세요"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 outline-blue-600"
        />
        <button
          type="submit"
          className="rounded-md bg-[#235ce8] px-6 font-semibold text-white"
        >
          검색
        </button>
      </form>
      {!normalizedQuery ? (
        <p className="py-12 text-center text-slate-600">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <h2 className="mb-2 text-lg font-semibold">‘{query}’ 검색 결과</h2>
          <p className="mb-6 text-sm text-slate-600">영화 {results.length}편</p>
          {results.length === 0 ? (
            <p className="py-12 text-center text-slate-600">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="space-y-5">
              {results.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-lg border border-slate-200 bg-white p-4 sm:gap-7 sm:p-5"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    aria-label={`${movie.title} 상세 보기`}
                    className="shrink-0"
                  >
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-40 w-24 rounded object-cover sm:h-52 sm:w-36"
                    />
                  </Link>
                  <div className="min-w-0 py-1">
                    <h3 className="text-lg font-bold">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        {movie.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {movie.originalTitle}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {movie.releaseDate}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-slate-700">
                      {movie.overview}
                    </p>
                    <BookmarkButton movieId={movie.id} title={movie.title} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
