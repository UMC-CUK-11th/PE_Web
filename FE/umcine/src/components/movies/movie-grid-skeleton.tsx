
"use client";

import { useUiPreferenceStore } from "../../stores/ui-preference-store";
import { cn } from "../../utils/cn";
import LoadingSpinner from "../common/loading-spinner";

export default function MovieGridSkeleton() {
  const cardSize = useUiPreferenceStore(
    (state) => state.cardSize,
  );

  return (
    <div className="pb-10" aria-busy="true">
      <LoadingSpinner
        size="sm"
        message="영화 목록을 불러오는 중이에요…"
        className="mb-8"
      />

      <div
        aria-hidden="true"
        className={cn(
          "mx-auto grid w-full max-w-6xl gap-6 px-5 lg:px-8",
          cardSize === "comfortable"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-[#26344c] bg-[#162238]"
          >
            <div className="cinema-skeleton aspect-[2/3] w-full" />

            <div className="flex min-h-[180px] flex-col gap-3 p-4">
              <div className="cinema-skeleton h-3 w-20 rounded-md" />

              <div className="cinema-skeleton h-5 w-4/5 rounded-md" />

              <div className="cinema-skeleton h-3 w-3/5 rounded-md" />

              <div className="cinema-skeleton mt-2 h-3 w-2/5 rounded-md" />

              <div className="cinema-skeleton mt-auto h-6 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
