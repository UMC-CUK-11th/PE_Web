import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type MovieCardSize = "default" | "compact";

interface ViewPreferenceStore {
  movieCardSize: MovieCardSize;
  setMovieCardSize: (movieCardSize: MovieCardSize) => void;
}

export const useViewPreferenceStore = create<ViewPreferenceStore>()(
  persist(
    (set) => ({
      movieCardSize: "default",
      setMovieCardSize: (movieCardSize) => set({ movieCardSize }),
    }),
    {
      name: "umcine-view-preference-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
