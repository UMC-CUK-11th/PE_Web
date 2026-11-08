import { MovieGrid } from "../../components/movie-grid";
import { useQuery } from "@tanstack/react-query";
import { movieListOptions } from "../../api/movies/movie-query-options";
import { useDisplayPreferencesStore } from "../../stores/display-preferences-store";
import { cn } from "../../utils/cn";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Pagination } from "../../components/pagination";
import { RetryButton } from "../../components/retry-button";
import { toMovieCard } from "../../utils/movies/to-movie-card";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const moviesQuery = useQuery(movieListOptions(page));
  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);

  const cardSize = useDisplayPreferencesStore((state) => state.cardSize);
  const setCardSize = useDisplayPreferencesStore((state) => state.setCardSize);

  return (
    <main className="mx-auto min-h-[calc(100vh-112px)] w-full max-w-[1264px] px-4 py-8 md:px-8 md:py-10" id="top">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-[22px] font-extrabold tracking-[-0.7px] md:text-2xl">영화 목록</h1>
        <div className="flex rounded-md border border-[#d9dbe1] bg-white p-1" aria-label="영화 카드 크기">
          {(["comfortable", "compact"] as const).map((size) => (
            <button
              className={cn(
                "rounded px-2.5 py-1 text-[10px] font-bold text-[#777a82] transition",
                cardSize === size && "bg-[#17181c] text-white",
              )}
              type="button"
              aria-pressed={cardSize === size}
              onClick={() => setCardSize(size)}
              key={size}
            >
              {size === "comfortable" ? "기본" : "작게"}
            </button>
          ))}
        </div>
      </div>
      {moviesQuery.isPending ? (
        <p className="py-20 text-center text-sm" role="status">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <div className="py-20 text-center text-sm"><p role="alert">영화 목록을 불러오지 못했어요.</p><RetryButton onRetry={() => void moviesQuery.refetch()} /></div>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-sm">조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies.map(toMovieCard)} cardSize={cardSize} />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(page) => navigate({ search: { page } })} />
        </>
      )}
    </main>
  );
}
