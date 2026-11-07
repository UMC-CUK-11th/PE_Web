import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CardSize = "comfortable" | "compact";

interface UiPreferenceStore {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

export const useUiPreferenceStore = create<UiPreferenceStore>()(
  persist(
    (set) => ({
      cardSize: "comfortable",

      setCardSize: (cardSize) =>
        set({
          cardSize,
        }),
    }),

    {
      name: "umcine-ui-preferences",

      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        cardSize: state.cardSize,
      }),
    },
  ),
);
