import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Migrate existing session bookmarks once, preserving their IDs.
const bookmarkStorage = {
  getItem(name: string) {
    const local = localStorage.getItem(name);
    if (local !== null) return local;
    const previous = sessionStorage.getItem(name);
    if (previous !== null) {
      localStorage.setItem(name, previous);
      sessionStorage.removeItem(name);
    }
    return previous;
  },
  setItem: (name: string, value: string) => localStorage.setItem(name, value),
  removeItem: (name: string) => localStorage.removeItem(name),
};

interface BookmarkStore {
  bookmarkedMovieIds: number[];
  toggleBookmark: (movieId: number) => void;
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

      storage: createJSONStorage(() => bookmarkStorage),

      partialize: (state) => ({
        bookmarkedMovieIds: state.bookmarkedMovieIds,
      }),
    },
  ),
);
