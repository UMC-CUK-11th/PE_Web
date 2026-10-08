import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "../utils/safe-storage";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

function isValidMovieId(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarkedMovieIds: [],
      toggleBookmark: (movieId) =>
        set((state) => ({
          bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
            ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
            : [...state.bookmarkedMovieIds, movieId],
        })),
    }),
    {
      name: "umcine-bookmark-store",
      // Web Storage가 실패하면 안전한 어댑터가 메모리 저장소로 대신 동작합니다.
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
      merge: (persistedState, currentState) => {
        const savedState = persistedState as Partial<BookmarkStore> | undefined;

        return {
          ...currentState,
          bookmarkedMovieIds: Array.isArray(savedState?.bookmarkedMovieIds)
            ? savedState.bookmarkedMovieIds.filter(isValidMovieId)
            : currentState.bookmarkedMovieIds,
        };
      },
    },
  ),
);
