import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { validBookmarkIds } from "../utils/bookmark-storage";

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
}

// 4.1, 5.1
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ bookmarkedMovieIds: state.bookmarkedMovieIds }),
      merge: (persisted, current) => ({
        ...current,
        bookmarkedMovieIds: validBookmarkIds(
          persisted &&
            typeof persisted === "object" &&
            "bookmarkedMovieIds" in persisted
            ? persisted.bookmarkedMovieIds
            : [],
        ),
      }),
    },
  ),
);
