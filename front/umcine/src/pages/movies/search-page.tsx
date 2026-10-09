import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../../components/movies/bookmark-button";

interface SearchFormProps {
  initialQuery: string;
  hasQuery: boolean;
}

function SearchForm({ initialQuery, hasQuery }: SearchFormProps) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(initialQuery);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <form className={cn(
      "flex w-full items-center gap-[9px] rounded-md border border-[#abb1bb] bg-white py-1 pr-[5px] pl-[13px] shadow-[0_5px_12px_rgba(17,24,39,0.08)]",
      hasQuery ? "h-9" : "h-[42px] max-w-[500px]",
    )} onSubmit={handleSubmit}>
      <img className="h-[18px] w-[18px] opacity-65" src="/icons/search.svg" alt="" />
      <input
        className="h-full min-w-0 flex-1 border-0 bg-transparent text-xs text-[#252a34] outline-none placeholder:text-[#a0a5ae]"
        aria-label="검색어"
        placeholder="스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
      />
      <button className="h-[30px] cursor-pointer rounded-[4px] border-0 bg-[#20242b] px-[14px] text-[11px] font-bold text-white" type="submit">검색</button>
    </form>
  );
}

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-[#f6f7f9]">
      <main className={cn(
        "mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-6 pt-4 pb-16 md:px-12",
        !normalizedQuery && "items-center justify-center pb-[160px] md:pb-[234px]",
      )}>
        {normalizedQuery && <h1 className="mb-2 text-[22px] leading-[1.35] font-extrabold tracking-[-1px] text-[#20252e]">영화 검색</h1>}
        {!normalizedQuery && <h2 className="mb-[22px] text-center text-[26px] leading-[1.3] font-extrabold tracking-[-1px] text-[#252a34]">어떤 영화를 찾고 있나요?</h2>}
        <SearchForm key={query ?? ""} initialQuery={query ?? ""} hasQuery={Boolean(normalizedQuery)} />

        {normalizedQuery && (
          <section className="mt-2" aria-live="polite">
            <div className="flex items-baseline justify-between border-b border-[#dfe2e7] pb-1.5">
              <h2 className="text-[15px] leading-[1.2] font-extrabold tracking-[-0.6px] text-[#252a34]">‘{query}’ 검색 결과</h2>
              <p className="text-[11px] text-[#8a909a]">영화 {searchResults.length}편</p>
            </div>
            {searchResults.length === 0 ? (
              <p className="py-[68px] text-center text-sm text-[#747b86]">검색 결과가 없어요.</p>
            ) : (
              <ul className="grid grid-cols-1 gap-x-7 md:grid-cols-2">
                {searchResults.map((movie) => (
                  <li className="flex min-w-0 gap-[14px] border-b border-[#e2e5e9] py-4" key={movie.id}>
                    <div className="relative h-[118px] w-20 shrink-0">
                      <img className="h-full w-full rounded object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                      <BookmarkButton movie={movie} className="top-1 right-1" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-extrabold tracking-[-0.4px] text-[#272c36]">{movie.title}</h3>
                      <p className="text-[10px] text-[#8b919b]">{movie.originalTitle} · {movie.releaseDate}</p>
                      <p className="mt-[7px] line-clamp-2 text-[10px] leading-[1.45] text-[#666d78]">{movie.overview}</p>
                      <Link className="mt-2 inline-block text-[10px] font-bold text-[#2865e7] no-underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                        상세 보기 <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      {normalizedQuery && (
        <footer className="flex min-h-9 items-center justify-center gap-2 border-t border-[#e7e9ed] bg-white px-6 text-center text-[10px] text-[#8a9099] md:justify-end md:px-12">
          <img className="w-[22px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </footer>
      )}
    </div>
  );
}
