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

  function handleClear() {
    setSearchText("");

    navigate({
      search: {},
    });
  }

  return (
    <main className="min-h-screen bg-[#F6F7F9]">
      {!normalizedQuery ? (
        // 검색 전 화면
        <section
          className="
                      flex flex-col justify-center items-center m-auto
                      w-full px-5 pt-[120px] pb-[60px]
                      sm:px-8 sm:pt-[150px]
                      md:w-[650px] md:px-0 md:pt-[180px]
                      lg:w-[720px] lg:pt-[200px]
                      xl:w-[790px] xl:pt-[210px] xl:pb-[90px]
                      transition-all duration-500 ease-out
                    "
        >
          <h1
            className="
                          mb-9 text-center text-[#17191E] font-bold
                          text-[30px]
                          sm:text-[34px]
                          md:text-[38px]
                          lg:text-[42px]
                          xl:text-[46px]
                        "
          >
            어떤 영화를 찾고 있나요?
          </h1>
          <form
            onSubmit={handleSubmit}
            className="relative w-full h-[74px] pr-[17px] pl-[21px] bg-white border-[2px] border-[#17191E] rounded-xl shadow-[rgba(17,19,24,0.08)]"
          >
            <input
              aria-label="검색어"
              spellCheck={false}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="absolute left-[59px] right-[90px] top-0 w-auto h-full border-none outline-none focus:outline-none"
              placeholder="예: 스파이더맨"
            />

            <img
              src="/icons/movie-icons/search.svg"
              alt=""
              className="absolute top-[23px] left-[21px] w-[24px] h-[24px]"
            />

            <button
              type="submit"
              className="absolute top-[14px] right-[17px] w-[59px] h-[42px] border border-[#17191E] rounded-[8px] bg-[#17191E] text-white text-[14px] font-bold"
            >
              검색
            </button>
          </form>
        </section>
      ) : (
        // 검색 후 화면
        <section className="px-5 md:px-10 xl:px-20 pt-12 pb-20 transition-all duration-500 ease-out">
          <h1 className="text-[22px] md:text-[33px] xl:text-[44px] mb-[17px]  font-bold text-[#17191E] text-left">
            영화 검색
          </h1>

          <form
            onSubmit={handleSubmit}
            className="relative w-full h-[58px] bg-white border border-[#D9DDE5] rounded-xl"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
              className="absolute top-1/2 left-5 w-5 h-5 -translate-y-1/2"
            />

            <input
              aria-label="검색어"
              spellCheck={false}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="absolute left-[58px] right-[155px] top-0 h-full border-none outline-none focus:outline-none"
            />

            <button
              type="button"
              onClick={handleClear}
              className="absolute right-[105px] top-1/2 -translate-y-1/2 text-[28px] text-[#606774] mx-[21px]"
            >
              ×
            </button>

            <button
              type="submit"
              className="absolute right-3 top-1/2 h-[42px] -translate-y-1/2 rounded-lg bg-[#17191E] px-5 text-[14px] font-bold text-white"
            >
              다시 검색
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between border-b border-[#D9DDE5] pb-5">
            <h2 className="text-[20px] font-bold">‘{query}’ 검색 결과</h2>

            <p className="text-[13px] text-[#969DAA]">
              영화 {searchResults.length}편 · 1페이지
            </p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-[#969DAA]">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex min-h-[260px] gap-5 border-b border-[#D9DDE5] py-6"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[210px] w-[140px] shrink-0 rounded-lg object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <h3 className="text-[20px] font-bold text-[#17191E] text-left">
                      {movie.title}
                    </h3>

                    <div className="mt-2 flex text-[14px] text-[#969DAA] text-left">
                      <p>{movie.originalTitle}</p>
                      <p>{movie.releaseDate}</p>
                    </div>

                    <p className="mt-2 mb-[20px] sm:mb-[30px] md:mb-[40px] xl:mb-[50px] line-clamp-3 text-[14px] leading-4 text-[#606774] text-left">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="text-[14px] font-bold text-[#0868F7] text-left"
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
