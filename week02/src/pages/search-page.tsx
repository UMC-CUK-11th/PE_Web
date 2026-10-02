import { type FormEvent, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { movies } from "../data/movie";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const [searchInput, setSearchInput] = useState(query);

  const results = useMemo(() => {
    if (!query) return [];
    const normalizedQuery = query.toLocaleLowerCase("ko-KR");
    return movies.filter((movie) =>
      [movie.title, movie.originalTitle, ...movie.genres].some((value) =>
        value.toLocaleLowerCase("ko-KR").includes(normalizedQuery),
      ),
    );
  }, [query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    setSearchParams(nextQuery ? { query: nextQuery } : {});
  };

  if (!query) {
    return (
      <main className="flex flex-1 items-start justify-center px-6 pt-[180px] max-sm:pt-24">
        <section className="w-full max-w-[700px] text-center">
          <h1 className="mb-10 text-[36px] font-extrabold tracking-[-1.5px] max-sm:text-[28px]">어떤 영화를 찾고 있나요?</h1>
          <form className="flex h-[66px] items-center rounded-xl border-2 border-[#202124] bg-white px-5 shadow-[0_14px_32px_rgba(35,39,47,0.08)]" onSubmit={handleSubmit} role="search">
            <img className="mr-4 size-5" src="/icons/search.svg" alt="" />
            <label className="sr-only" htmlFor="movie-search">영화 검색어</label>
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-base outline-none placeholder:text-[#a3a9b2]"
              id="movie-search"
              type="search"
              value={searchInput}
              placeholder="예: 스파이더맨"
              autoFocus
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button className="h-10 cursor-pointer rounded-lg border-0 bg-[#18191b] px-5 text-sm font-bold text-white" type="submit">검색</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),1200px)] py-7 pb-20 max-[420px]:w-[calc(100%-32px)]">
        <h1 className="mb-5 text-[34px] font-extrabold tracking-[-1.3px]">영화 검색</h1>
        <form className="flex h-12 items-center border-y border-[#dfe3e8] bg-white px-4" onSubmit={handleSubmit} role="search">
          <img className="mr-4 size-5" src="/icons/search.svg" alt="" />
          <label className="sr-only" htmlFor="movie-search-results">영화 검색어</label>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold outline-none"
            id="movie-search-results"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <button className="mr-5 grid size-7 cursor-pointer place-items-center border-0 bg-transparent text-xl text-[#8c939d]" type="button" aria-label="검색어 지우기" onClick={() => setSearchInput("")}>×</button>
          <button className="h-9 cursor-pointer rounded-md border-0 bg-[#18191b] px-4 text-xs font-bold text-white" type="submit">다시 검색</button>
        </form>

        {results.length === 0 ? (
          <section className="py-32 text-center" aria-live="polite">
            <img className="mx-auto mb-5 size-10 opacity-40" src="/icons/movie.svg" alt="" />
            <h2 className="mb-2 text-xl font-bold">검색 결과가 없어요.</h2>
            <p className="text-sm text-[#7f8792]">다른 검색어로 다시 시도해 주세요.</p>
          </section>
        ) : (
          <section aria-live="polite">
            <div className="flex items-center justify-between border-b border-[#dfe3e8] py-4">
              <h2 className="text-base font-bold">‘{query}’ 검색 결과</h2>
              <span className="text-xs text-[#8b929c]">영화 {results.length}편</span>
            </div>
            <div className="grid grid-cols-2 max-[760px]:grid-cols-1">
              {results.map((movie) => (
                <article className="flex min-h-[210px] gap-4 border-b border-[#dfe3e8] py-5 even:pl-8 odd:pr-8 max-[760px]:px-0" key={movie.id}>
                  <Link className="shrink-0" to={`/movies/${movie.id}`}>
                    <img className="h-[168px] w-[112px] rounded-md object-cover" src={movie.posterPath} alt={`${movie.title} 포스터`} />
                  </Link>
                  <div className="min-w-0 pt-1">
                    <h3 className="mb-2 text-base font-bold">
                      <Link className="text-inherit no-underline" to={`/movies/${movie.id}`}>{movie.title}</Link>
                    </h3>
                    <p className="mb-3 flex flex-wrap gap-x-2 text-xs text-[#9298a1]">
                      <span>{movie.originalTitle}</span>
                      <span>{movie.releaseDate}</span>
                    </p>
                    <p className="mb-3 text-xs text-[#777f89]">{movie.genres.join(" · ")}</p>
                    <p className="line-clamp-2 text-xs leading-5 text-[#555d67]">{movie.overview}</p>
                    <Link className="mt-5 inline-block text-xs font-bold text-[#2877eb] no-underline" to={`/movies/${movie.id}`}>상세 보기 →</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
