import { MovieGrid } from "../../components/movie-grid";
import { movies } from "../../data/movie";
import { useDisplayPreferencesStore } from "../../stores/display-preferences-store";
import { cn } from "../../utils/cn";

export function MovieListPage() {
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
      <MovieGrid movies={movies} cardSize={cardSize} />
    </main>
  );
}
