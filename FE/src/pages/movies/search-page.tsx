import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movie";

function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery)
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

      {!normalizedQuery ? (
        <div className="rounded-xl bg-gray-50 px-6 py-12 text-center">
          <p className="text-gray-500">검색어를 입력해 주세요.</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              ‘{query}’ 검색 결과
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-xl bg-gray-50 px-6 py-12 text-center">
              <p className="text-gray-500">
                검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {searchResults.map((movie) => (
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
                      src={movie.posterPath}
                      alt={`${movie.title} 포스터`}
                      className="h-48 w-32 rounded-lg object-cover"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      <h3 className="text-lg font-bold text-gray-900 hover:underline">
                        {movie.title}
                      </h3>
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      {movie.originalTitle}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {movie.releaseDate}
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
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

export default SearchPage;