import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      // 서버에는 localStorage가 없음 → 자동으로 읽지 않고, 브라우저에서 Providers가 rehydrate()로 읽음
      // (자동으로 읽으면 브라우저 첫 화면이 서버 HTML과 달라져 hydration 오류가 남)
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
