import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { SiteFooter } from "../../components/layout/site-footer";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchContent key={query ?? ""} query={query} />;
}

interface SearchContentProps {
  query?: string;
}

function SearchContent({ query }: SearchContentProps) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(query?.trim()));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    let ignore = false;

    if (!normalizedQuery) return;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) {
          setMovies([]);
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }


  return (
    <>
      <main className="mx-auto min-h-[calc(100vh-132px)] w-[min(calc(100%-80px),1200px)] pt-[42px] pb-16">
        <h1 className="mb-6 text-[28px] leading-tight font-bold tracking-[-1px] text-[#181a20]">
          영화 검색
        </h1>

        <form className="flex max-w-[680px] gap-2" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="movie-search">
            검색어
          </label>
          <input
            className="h-12 flex-1 rounded-lg border border-[#d9dde5] bg-white px-4 text-[15px] outline-none placeholder:text-[#9da2ad] focus:border-[#2669ee] focus:ring-3 focus:ring-blue-500/15"
            id="movie-search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="영화 제목이나 원제를 검색해 보세요"
          />
          <button
            className="h-12 cursor-pointer rounded-lg bg-[#2669ee] px-6 text-sm font-bold text-white hover:bg-[#1559dd]"
            type="submit"
          >
            검색
          </button>
        </form>

        {!normalizedQuery ? (
          <div className="mt-16 rounded-xl border border-dashed border-[#d7dbe3] bg-white px-6 py-16 text-center text-[#7b808b]">
            검색어를 입력해 주세요.
          </div>
        ) : (
          <section className="mt-10" aria-live="polite">
            <h2 className="text-xl font-bold text-[#202228]">
              ‘{query}’ 검색 결과
            </h2>
            {!isLoading && !errorMessage && (
              <p className="mt-2 text-sm text-[#7b808b]">영화 {movies.length}편</p>
            )}

            {isLoading ? (
              <div className="mt-8 rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]" role="status">
                검색 결과를 불러오는 중이에요.
              </div>
            ) : errorMessage ? (
              <div className="mt-8 rounded-xl bg-white px-6 py-16 text-center text-[#7b808b]" role="alert">
                {errorMessage}
              </div>
            ) : movies.length === 0 ? (
              <div className="mt-8 rounded-xl border border-dashed border-[#d7dbe3] bg-white px-6 py-16 text-center text-[#7b808b]">
                검색 결과가 없어요.
              </div>
            ) : (
              <ul className="mt-6 space-y-4">
                {movies.map((movie) => (
                  <li
                    className="flex overflow-hidden rounded-xl border border-[#e7e9ee] bg-white shadow-sm"
                    key={movie.id}
                  >
                    <Link
                      className="w-[150px] shrink-0"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      {getTmdbPosterUrl(movie.poster_path) ? (
                        <img
                          className="h-[210px] w-full object-cover"
                          src={getTmdbPosterUrl(movie.poster_path)!}
                          alt={`${movie.title} 포스터`}
                        />
                      ) : (
                        <span className="flex h-[210px] items-center justify-center bg-[#e7e9ee] text-sm text-[#737985]">
                          이미지 없음
                        </span>
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col p-6">
                      <Link
                        className="w-fit text-xl font-bold text-[#202228] no-underline hover:text-[#2669ee]"
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        {movie.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#7b808b]">
                        {movie.original_title}
                      </p>
                      <p className="mt-3 text-sm font-medium text-[#5b606b]">
                        {movie.release_date || "개봉일 정보 없음"}
                      </p>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#666b75]">
                        {movie.overview}
                      </p>
                      <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                        <Link
                          className="w-fit text-sm font-bold text-[#2669ee] no-underline"
                          to="/movies/$movieId"
                          params={{ movieId: String(movie.id) }}
                        >
                          상세 보기 →
                        </Link>
                        <BookmarkButton
                          movieId={movie.id}
                          movieTitle={movie.title}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
