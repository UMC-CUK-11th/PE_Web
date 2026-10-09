import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "../utils/safe-storage";

export type CardSize = "comfortable" | "compact";

interface DisplayPreferencesStore {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

function isCardSize(value: unknown): value is CardSize {
  return value === "comfortable" || value === "compact";
}

export const useDisplayPreferencesStore = create<DisplayPreferencesStore>()(
  persist(
    (set) => ({
      cardSize: "comfortable",
      setCardSize: (cardSize) => set({ cardSize }),
    }),
    {
      name: "umcine-display-preferences",
      // localStorage 실패 시에도 현재 탭의 카드 크기 상태는 메모리에 유지됩니다.
      storage: createJSONStorage(() => safeLocalStorage),
      merge: (persistedState, currentState) => {
        const savedState = persistedState as Partial<DisplayPreferencesStore> | undefined;

        return {
          ...currentState,
          cardSize: isCardSize(savedState?.cardSize)
            ? savedState.cardSize
            : currentState.cardSize,
        };
      },
    },
  ),
);
