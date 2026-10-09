// 이 파일은 /search 화면의 검색 폼과 결과 목록을 담당한다.
// 검색어를 URL의 query에 넣어 새로고침하거나 주소를 공유해도 같은 결과를 보여준다.
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  // routes/search.tsx가 검증한 query를 읽는다. 값이 없으면 빈 검색어로 취급한다.
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  // 앞뒤 공백과 영문 대소문자 차이를 없애고, 한글 제목·영문 원제를 함께 검색한다.
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // 검색어를 URL 쿼리로 기록해 새로고침·공유 시에도 검색 조건을 유지한다.
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();

    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 py-8">
      <h1 className="mb-6 text-2xl font-bold">영화 검색</h1>

      {/* URL의 query가 바뀌면 입력창도 새 값으로 다시 만들어 동기화한다. */}
      <form
        key={query ?? ""}
        onSubmit={handleSubmit}
        className="mb-10 flex gap-2"
      >
        <label className="sr-only" htmlFor="movie-query">
          검색어
        </label>
        <input
          id="movie-query"
          name="query"
          defaultValue={query ?? ""}
          placeholder="영화 제목 또는 원제를 입력하세요"
          className="min-w-0 flex-1 rounded border border-gray-700 bg-[#1f2128] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-[#e50914]"
        />
        <button
          type="submit"
          className="rounded bg-[#e50914] px-5 py-3 font-bold hover:bg-red-700"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="py-10 text-center text-gray-400">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
          <p className="mt-2 text-gray-400">
            영화 {searchResults.length}편
          </p>

          {searchResults.length === 0 ? (
            <p className="py-10 text-center text-gray-400">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 rounded-lg bg-[#1f2128] p-4"
                >
                  <div className="relative shrink-0">
                    <img
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-36 w-24 rounded object-cover"
                    />
                    {/* 목록 카드와 같은 Zustand 북마크 상태를 사용한다. */}
                    <BookmarkButton
                      movieId={movie.id}
                      movieTitle={movie.title}
                      className="absolute right-1 top-1"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="text-lg font-bold">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                        className="hover:text-[#e50914]"
                      >
                        {movie.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {movie.originalTitle} · {movie.releaseDate}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm text-gray-300">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto pt-3 text-sm font-bold text-[#e50914]"
                    >
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
