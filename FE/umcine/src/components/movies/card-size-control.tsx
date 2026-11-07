import { useUiPreferenceStore } from "../../stores/ui-preference-store";
import { cn } from "../../utils/cn";

export default function CardSizeControl() {
  const cardSize = useUiPreferenceStore((state) => state.cardSize);

  const setCardSize = useUiPreferenceStore((state) => state.setCardSize);

  return (
    <div className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-end px-5 lg:px-8">
      <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-sm">
        <span className="px-2 text-xs font-semibold text-zinc-500">
          카드 크기
        </span>

        <button
          type="button"
          onClick={() => setCardSize("comfortable")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-bold transition",
            cardSize === "comfortable"
              ? "bg-zinc-950 text-white"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
          )}
        >
          보통
        </button>

        <button
          type="button"
          onClick={() => setCardSize("compact")}
          className={cn(
            "rounded-xl px-4 py-2 text-xs font-bold transition",
            cardSize === "compact"
              ? "bg-zinc-950 text-white"
              : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
          )}
        >
          작게
        </button>
      </div>
    </div>
  );
}
