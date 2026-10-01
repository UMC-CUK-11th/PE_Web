import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    // 워크북의 방식: 뒤로/앞으로 가기로 URL이 바뀌면 입력창도 맞춰요.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL과 편집 중인 입력값을 동기화하는 학습 예제예요.
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="text-3xl font-bold tracking-tight">영화 검색</h1>
      <p className="mt-3 text-slate-600">영화 제목이나 원제로 검색해 보세요.</p>
      <form onSubmit={handleSubmit} role="search" className="mt-8 mb-10 flex gap-3">
        <input
          aria-label="검색어"
          placeholder="예: 스파이더맨, The Odyssey"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button type="submit" className="shrink-0 cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">검색</button>
      </form>
      {!normalizedQuery ? (
        <p role="status" className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2 className="text-xl font-bold break-words">‘{query}’ 검색 결과</h2>
          <p role="status" className="mt-2 mb-6 text-sm text-slate-500">영화 {searchResults.length}편</p>
          {searchResults.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="space-y-5">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:gap-7">
                  <img src={movie.posterPath} alt={`${movie.title} 포스터`} loading="lazy" className="aspect-[2/3] w-36 shrink-0 self-start rounded-lg object-cover" />
                  <div className="min-w-0 py-1">
                  <h3 className="text-xl font-bold break-keep">{movie.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{movie.originalTitle}</p>
                  <p className="mt-3 text-sm text-slate-500">{movie.releaseDate}</p>
                  <p className="mt-3 leading-7 text-slate-600">{movie.overview}</p>
                  <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-4 inline-block rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600">
                    상세 보기
                  </Link>
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
