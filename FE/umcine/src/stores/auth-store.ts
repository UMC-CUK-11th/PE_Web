import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeLocalStorage } from "../utils/safe-storage";

interface AuthStore {
  accessToken: string | null;
  hydrated: boolean;
  sessionVersion: number;
  notice: string | null;
  setAccessToken: (token: string | null) => void;
  expireSession: () => void;
}

export const useAuthStore = create<AuthStore>()(persist((set) => ({
  accessToken: null,
  hydrated: false,
  sessionVersion: 0,
  notice: null,
  setAccessToken: (accessToken) => set((state) => ({ accessToken, notice: null, sessionVersion: state.sessionVersion + 1 })),
  expireSession: () => set((state) => ({ accessToken: null, sessionVersion: state.sessionVersion + 1, notice: "인증이 만료되었어요. 다시 로그인해 주세요." })),
}), {
  name: "umcine-auth-store",
  skipHydration: true,
  storage: createJSONStorage(() => safeLocalStorage),
  partialize: (state) => ({ accessToken: state.accessToken }),
  merge: (persisted, state) => {
    const value = (persisted as { accessToken?: unknown } | undefined)?.accessToken;
    const accessToken = typeof value === "string" && value.length > 0 && value.length < 8192 ? value : null;
    return { ...state, accessToken, sessionVersion: state.sessionVersion + (accessToken !== state.accessToken ? 1 : 0) };
  },
}));
