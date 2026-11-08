import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { adaptTmdbMovie } from "../api/tmdb-adapter";
import { popularMoviesQueryOptions } from "../api/movie-query-options";
import { MovieGrid } from "../components/movie-grid";
import { Pagination } from "../components/pagination";
import { EmptyState, ErrorState, LoadingState } from "../components/request-state";
import { useViewPreferenceStore } from "../stores/view-preference-store";
import { cn } from "../utils/cn";

function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function MovieListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parsePage(searchParams.get("page"));
  const movieCardSize = useViewPreferenceStore((state) => state.movieCardSize);
  const setMovieCardSize = useViewPreferenceStore((state) => state.setMovieCardSize);
  const movieQuery = useQuery(popularMoviesQueryOptions(currentPage));

  const handlePageChange = (page: number) => {
    setSearchParams(page === 1 ? {} : { page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),1200px)] py-[31px] pb-[92px] max-[420px]:w-[calc(100%-32px)]">
        <div className="mb-[21px] flex items-center justify-between gap-4">
          <h1 className="text-[34px] font-extrabold leading-[1.2] tracking-[-1.7px] max-sm:text-[28px]">인기 영화</h1>
          <div className="flex rounded-lg border border-[#dfe3e8] bg-white p-1" role="group" aria-label="영화 카드 크기">
            <button
              className={cn(
                "h-8 cursor-pointer rounded-md border-0 px-3 text-xs font-bold transition-colors",
                movieCardSize === "default" ? "bg-[#18191b] text-white" : "bg-transparent text-[#737b86]",
              )}
              type="button"
              aria-pressed={movieCardSize === "default"}
              onClick={() => setMovieCardSize("default")}
            >
              기본 보기
            </button>
            <button
              className={cn(
                "h-8 cursor-pointer rounded-md border-0 px-3 text-xs font-bold transition-colors",
                movieCardSize === "compact" ? "bg-[#18191b] text-white" : "bg-transparent text-[#737b86]",
              )}
              type="button"
              aria-pressed={movieCardSize === "compact"}
              onClick={() => setMovieCardSize("compact")}
            >
              작게 보기
            </button>
          </div>
        </div>

        {movieQuery.isPending && <LoadingState />}
        {movieQuery.isError && <ErrorState error={movieQuery.error} onRetry={() => void movieQuery.refetch()} />}
        {movieQuery.isSuccess && movieQuery.data.results.length === 0 && (
          <EmptyState title="표시할 영화가 없어요." description="잠시 후 다시 확인해 주세요." />
        )}
        {movieQuery.isSuccess && movieQuery.data.results.length > 0 && (
          <>
            <MovieGrid movies={movieQuery.data.results.map(adaptTmdbMovie)} cardSize={movieCardSize} />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.min(movieQuery.data.total_pages, 500)}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </main>
  );
}
