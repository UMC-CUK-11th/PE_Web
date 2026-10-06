import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

const searchIcon = "/icons/movie-icons/movie-icons/search.svg";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  return <SearchPageContent key={query ?? ""} query={query} />;
}

interface SearchPageContentProps {
  query?: string;
}

function SearchPageContent({ query }: SearchPageContentProps) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const normalizedQuery = query?.trim().toLocaleLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter((movie) =>
        [movie.title, movie.originalTitle].some((title) =>
          title.toLocaleLowerCase().includes(normalizedQuery),
        ),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-112px)] w-full max-w-[1264px] px-4 py-8 md:px-8 md:py-10">
      {!normalizedQuery ? (
        <section className="flex min-h-[520px] flex-col items-center justify-center pb-24 text-center">
          <h1 className="mb-7 text-xl font-extrabold tracking-[-0.6px] md:text-2xl">어떤 영화를 찾고 있나요?</h1>
          <SearchForm searchText={searchText} onSearchTextChange={setSearchText} onSubmit={handleSubmit} />
          <p className="mt-4 text-xs text-[#8b8e96]">검색어를 입력해 영화를 찾아보세요.</p>
        </section>
      ) : (
        <section>
          <h1 className="mb-5 text-[22px] font-extrabold tracking-[-0.7px] md:text-2xl">영화 검색</h1>
          <SearchForm searchText={searchText} onSearchTextChange={setSearchText} onSubmit={handleSubmit} />

          <div className="mt-5 flex items-end justify-between border-b border-[#dedfe3] pb-3">
            <h2 className="text-sm font-bold">‘{query?.trim()}’ 검색 결과</h2>
            <p className="text-[11px] text-[#777a82]">총 {searchResults.length}개</p>
          </div>

          {searchResults.length === 0 ? (
            <div className="grid min-h-72 place-content-center text-center">
              <p className="text-sm font-bold">검색 결과가 없어요.</p>
              <p className="mt-2 text-xs text-[#8b8e96]">다른 검색어로 다시 시도해 보세요.</p>
            </div>
          ) : (
            <ul className="grid gap-x-8 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li className="border-b border-[#e8e9ed] py-5" key={movie.id}>
                  <article className="flex gap-4">
                    <Link className="shrink-0" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                      <img className="h-32 w-[86px] rounded-[3px] object-cover shadow-sm" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                    </Link>
                    <div className="min-w-0 py-1">
                      <h3 className="truncate text-[13px] font-bold">
                        <Link className="text-inherit no-underline hover:text-[#2563eb]" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                          {movie.title}
                        </Link>
                      </h3>
                      <p className="mt-1 truncate text-[10px] text-[#8b8e96]">{movie.originalTitle}</p>
                      <p className="mt-2 text-[10px] text-[#696c73]">{movie.releaseDate}</p>
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-[#5f626a]">{movie.overview}</p>
                      <Link className="mt-2 inline-block text-[10px] font-bold text-[#2563eb] no-underline hover:underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                        상세 보기 →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

interface SearchFormProps {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
}

function SearchForm({ searchText, onSearchTextChange, onSubmit }: SearchFormProps) {
  return (
    <form className="flex h-11 w-full max-w-2xl items-center rounded-md border border-[#cfd1d7] bg-white px-3 shadow-[0_5px_18px_rgba(23,24,28,0.06)] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/10" onSubmit={onSubmit}>
      <img className="mr-2 size-4 opacity-60" src={searchIcon} alt="" />
      <input
        className="min-w-0 flex-1 border-0 bg-transparent text-xs outline-none placeholder:text-[#afb1b7]"
        aria-label="검색어"
        placeholder="제목을 검색해 보세요"
        value={searchText}
        onChange={(event) => onSearchTextChange(event.target.value)}
      />
      {searchText && (
        <button className="mr-2 text-sm text-[#85878e]" type="button" aria-label="검색어 지우기" onClick={() => onSearchTextChange("")}>
          ×
        </button>
      )}
      <button className="h-7 rounded bg-[#17181c] px-3 text-[10px] font-bold text-white transition hover:bg-black" type="submit">
        검색
      </button>
    </form>
  );
}
