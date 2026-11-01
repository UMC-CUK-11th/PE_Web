import { MovieGrid } from "../../components/movie-grid";
import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { useDisplayPreferencesStore } from "../../stores/display-preferences-store";
import { cn } from "../../utils/cn";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Pagination } from "../../components/pagination";
import { RetryButton } from "../../components/retry-button";
import { toMovieCard } from "../../utils/movies/to-movie-card";

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const [attempt, setAttempt] = useState(0);
  return <MovieListContent key={`${page}:${attempt}`} page={page} onRetry={() => setAttempt((value) => value + 1)} />;
}

function MovieListContent({ page, onRetry }: { page: number; onRetry: () => void }) {
  const navigate = useNavigate({ from: "/" });
  const [totalPages, setTotalPages] = useState(0);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getMovies({ page });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, 500));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadMovies();
    return () => {
      ignore = true;
    };
  }, [page]);
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
      {isLoading ? (
        <p className="py-20 text-center text-sm" role="status">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <div className="py-20 text-center text-sm"><p role="alert">{errorMessage}</p><RetryButton onRetry={onRetry} /></div>
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
