import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const normalizedQuery = query?.trim() ?? "";
  useEffect(() => { setSearchText(query ?? ""); }, [query]);
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });
  const searchResults = searchQuery.data?.results ?? [];
  const isLoading = searchQuery.isLoading;
  const errorMessage = searchQuery.isError ? "검색 결과를 불러오지 못했어요." : null;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ search: searchText.trim() ? { query: searchText.trim() } : {} });
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

              {isLoading ? <p role="status">검색 결과를 불러오는 중이에요.</p> : errorMessage ? <p role="alert">{errorMessage}</p> : searchQuery.isSuccess && searchResults.length === 0 ? (
                <p className="py-16 text-center text-sm text-[#777c85]">
                  검색 결과가 없어요.
                </p>
              ) : (
                <ul className="grid list-none grid-cols-1 gap-x-8 p-0 md:grid-cols-2">
                  {searchResults.map((movie) => (
                    <li className="border-b border-[#e1e3e8]" key={movie.id}>
                      <div className="flex min-h-[172px] gap-4 py-4">
                        <MovieImage
                          className="h-[142px] w-[96px] shrink-0 rounded-[5px] object-cover"
                          src={getTmdbPosterUrl(movie.poster_path)}
                          alt={`${movie.title} 포스터`}
                        />

                        <div className="flex min-w-0 flex-col py-1">
                          <h3 className="m-0 text-[15px] font-semibold text-[#252830]">
                            {movie.title}
                          </h3>
                          <p className="mb-0 mt-1 text-[11px] text-[#858992]">
                            {movie.original_title} · {movie.release_date}
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
