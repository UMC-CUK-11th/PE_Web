import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

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

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-86px)] bg-[#f7f8fa] text-[#191919]">
      {!normalizedQuery ? (
        /* 검색 전 화면 */
        <section className="mx-auto flex min-h-[650px] w-[min(680px,calc(100%-64px))] flex-col items-center pt-[175px]">
          <h1 className="mb-[38px] text-[32px] font-bold">
            어떤 영화를 찾고 있나요?
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex h-[64px] w-full items-center rounded-[10px] border-2 border-[#191919] bg-white px-[18px] shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="mr-3 h-5 w-5 opacity-60"
            />

            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="예: 스파이더맨"
              className="min-w-0 flex-1 border-none bg-transparent text-[14px] outline-none placeholder:text-[#a0a5ad]"
            />

            <button
              type="submit"
              className="h-[42px] cursor-pointer rounded-[8px] border-0 bg-[#191919] px-[20px] text-[14px] font-bold text-white"
            >
              검색
            </button>
          </form>
        </section>
      ) : (
        /* 검색 결과 화면 */
        <section className="mx-auto w-[min(1210px,calc(100%-64px))] py-[28px] pb-[70px]">
          <h1 className="mb-[22px] text-[32px] font-bold">영화 검색</h1>

          <form
            onSubmit={handleSubmit}
            className="flex h-[54px] items-center rounded-[8px] border border-[#d9dde3] bg-white px-[16px]"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="mr-3 h-5 w-5 opacity-60"
            />

            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="min-w-0 flex-1 border-none bg-transparent text-[14px] font-semibold outline-none"
            />

            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchText("")}
              className="mr-4 cursor-pointer border-0 bg-transparent text-[25px] leading-none text-[#737780]"
            >
              ×
            </button>

            <button
              type="submit"
              className="h-[40px] cursor-pointer rounded-[7px] border-0 bg-[#191919] px-[20px] text-[13px] font-bold text-white"
            >
              다시 검색
            </button>
          </form>

          <div className="flex items-center justify-between border-b border-[#e1e4e8] py-[18px]">
            <h2 className="m-0 text-[18px] font-bold">‘{query}’ 검색 결과</h2>

            <p className="m-0 text-[12px] text-[#969ba3]">
              영화 {searchResults.length}편 · 1페이지
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-20 text-center text-[#737780]">
              검색 결과가 없어요.
            </div>
          ) : (
            <ul className="m-0 grid list-none grid-cols-2 p-0">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex min-h-[225px] gap-[18px] border-b border-[#e1e4e8] py-[20px] pr-[32px] even:pl-[32px]"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[180px] w-[120px] shrink-0 rounded-[8px] object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h3 className="mb-[8px] text-[17px] font-bold">
                      {movie.title}
                    </h3>

                    <div className="mb-[12px] flex gap-3 text-[12px] text-[#969ba3]">
                      <span>{movie.originalTitle}</span>
                      <span>{movie.releaseDate}</span>
                    </div>

                    <p className="m-0 line-clamp-2 text-[13px] leading-[1.7] text-[#737780]">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto w-fit text-[13px] font-bold text-[#2878f0] no-underline"
                    >
                      상세 보기 →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
