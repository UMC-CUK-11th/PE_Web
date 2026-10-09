import { useState } from "react";
import { MovieGrid } from "../components/movie-grid";
import { Pagination } from "../components/pagination";
import { movies } from "../data/movie";
import { useViewPreferenceStore } from "../stores/view-preference-store";
import { cn } from "../utils/cn";

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const movieCardSize = useViewPreferenceStore((state) => state.movieCardSize);
  const setMovieCardSize = useViewPreferenceStore((state) => state.setMovieCardSize);

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),1200px)] py-[31px] pb-[92px] max-[420px]:w-[calc(100%-32px)]">
        <div className="mb-[21px] flex items-center justify-between gap-4">
          <h1 className="text-[34px] font-extrabold leading-[1.2] tracking-[-1.7px] max-sm:text-[28px]">영화 목록</h1>
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
        <MovieGrid movies={movies} cardSize={movieCardSize} />
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </div>
    </main>
  );
}
