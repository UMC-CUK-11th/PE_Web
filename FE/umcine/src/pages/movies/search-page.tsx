import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
//4주차 추가 코드
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  // /search?query=... 에서 검증된 query 값을 읽는다.
  const { query } = useSearch({ from: "/search" });

  // 검색어를 URL의 search param에 반영하기 위해 사용한다.
  const navigate = useNavigate({ from: "/search" });

  // 입력창에 현재 보이는 검색어를 상태로 관리한다.
  const [searchText, setSearchText] = useState(query ?? "");

  // 뒤로 가기/앞으로 가기로 query가 바뀌면 입력창의 값도 URL과 맞춘다.
  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  // 검색 비교를 쉽게 하기 위해 양끝 공백을 지우고 영문 대소문자를 맞춘다.
  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  // 제목이나 원제에 검색어가 포함된 영화만 남긴다.
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // form의 기본 동작인 페이지 새로고침을 막는다.
    event.preventDefault();

    const nextQuery = searchText.trim();

    // path는 /search로 유지하고 query 값만 URL에 반영한다.
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f5f6f8]">
      <section
        className={
          normalizedQuery
            ? "mx-auto w-full max-w-[1180px] px-6 py-8"
            : "flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16"
        }
      >
        <div className={normalizedQuery ? "w-full" : "w-full max-w-[700px]"}>
          <h1
            className={
              normalizedQuery
                ? "mb-5 text-[25px] font-bold text-[#20232a]"
                : "mb-7 text-center text-[27px] font-bold text-[#20232a]"
            }
          >
            {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
          </h1>

          <form
            className="flex h-12 items-center gap-2 rounded-[6px] border border-[#b9bdc6] bg-white px-3"
            onSubmit={handleSubmit}
          >
            <img className="h-4 w-4 opacity-70" src="/icons/search.svg" alt="" />
            <input
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-[14px] outline-none"
              aria-label="검색어"
              placeholder="예: 스파이더맨"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
            <button
              className="h-8 rounded-[4px] bg-[#20232a] px-4 text-[12px] text-white"
              type="submit"
            >
              검색
            </button>
          </form>

          {!normalizedQuery ? (
            <p className="mt-4 text-center text-[13px] text-[#8b8f97]">
              검색어를 입력해 주세요.
            </p>
          ) : (
            <>
              <div className="mb-4 mt-7 flex items-baseline justify-between border-b border-[#e1e3e8] pb-3">
                <h2 className="m-0 text-[16px] font-semibold text-[#262930]">
                  ‘{query}’ 검색 결과
                </h2>
                <p className="m-0 text-[13px] text-[#7b7f88]">
                  영화 {searchResults.length}편
                </p>
              </div>

              {searchResults.length === 0 ? (
                <p className="py-16 text-center text-sm text-[#777c85]">
                  검색 결과가 없어요.
                </p>
              ) : (
                <ul className="grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-2">
                  {searchResults.map((movie) => (
                    <li className="border-b border-[#e1e3e8]" key={movie.id}>
                      <div className="flex min-h-[172px] gap-4 py-4">
                        <img
                          className="h-[142px] w-[96px] shrink-0 rounded-[5px] object-cover"
                          src={movie.posterPath}
                          alt={`${movie.title} 포스터`}
                        />

                        <div className="flex min-w-0 flex-col py-1">
                          <h3 className="m-0 text-[15px] font-semibold text-[#252830]">
                            {movie.title}
                          </h3>
                          <p className="mb-0 mt-1 text-[11px] text-[#858992]">
                            {movie.originalTitle} · {movie.releaseDate}
                          </p>
                          <p className="mb-0 mt-3 line-clamp-3 text-[12px] leading-5 text-[#666b74]">
                            {movie.overview}
                          </p>

                          <BookmarkButton movieId={movie.id} />

                          {/* 검색 결과에서도 해당 영화의 상세 route로 이동한다. */}
                          <Link
                            className="mt-auto pt-2 text-[12px] font-medium text-[#536be8] no-underline"
                            to="/movies/$movieId"
                            params={{ movieId: String(movie.id) }}
                          >
                            상세 보기
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
