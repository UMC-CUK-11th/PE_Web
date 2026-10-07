import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardSize = "comfortable" | "compact";

interface DisplayPreferencesStore {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

export const useDisplayPreferencesStore = create<DisplayPreferencesStore>()(
  persist(
    (set) => ({
      cardSize: "comfortable",
      setCardSize: (cardSize) => set({ cardSize }),
    }),
    {
      name: "umcine-display-preferences",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
