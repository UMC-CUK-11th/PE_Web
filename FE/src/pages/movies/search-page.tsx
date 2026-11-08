import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

import { useBookmarkStore } from "../../stores/bookmark-store";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";

function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { bookmarkedMovieIds, toggleBookmark } = useBookmarkStore();

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setMovies(response.results);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage("검색 결과를 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 flex w-full max-w-2xl gap-3"
      >
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="영화 제목을 검색해 주세요"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
        />

        <button
          type="submit"
          className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          검색
        </button>
      </form>

      {!query.trim() ? (
        <div className="rounded-xl bg-gray-50 px-6 py-12 text-center">
          <p className="text-gray-500">검색어를 입력해 주세요.</p>
        </div>
      ) : isLoading ? (
        <div className="rounded-xl bg-gray-50 px-6 py-12 text-center">
          <p className="text-gray-500">검색 중...</p>
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl bg-red-50 px-6 py-12 text-center">
          <p className="text-red-500">{errorMessage}</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-6 py-12 text-center">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              ‘{query}’ 검색 결과
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              영화 {movies.length}편
            </p>
          </div>

          <ul className="space-y-6">
            {movies.map((movie) => {
              const isBookmarked = bookmarkedMovieIds.includes(movie.id);

              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.png";

              return (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-xl border border-gray-200 p-4 transition hover:shadow-md"
                >
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="shrink-0"
                  >
                    <img
                      src={posterUrl}
                      alt={`${movie.title} 포스터`}
                      className="h-48 w-32 rounded-lg object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <Link
                        to="/movies/$movieId"
                        params={{ movieId: String(movie.id) }}
                      >
                        <h3 className="text-lg font-bold text-gray-900 hover:underline">
                          {movie.title}
                        </h3>
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleBookmark(movie.id)}
                        className="text-2xl"
                        aria-label={
                          isBookmarked ? "북마크 해제" : "북마크 추가"
                        }
                      >
                        {isBookmarked ? "★" : "☆"}
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {movie.original_title}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {movie.release_date}
                    </p>

                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-700">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto pt-4 text-sm font-semibold text-gray-900 hover:underline"
                    >
                      상세 보기 →
                    </Link>
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

export default SearchPage;