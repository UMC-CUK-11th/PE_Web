import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getQueryClient } from "../config/query-client";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      setAccessToken: (accessToken) => {
        if (accessToken !== get().accessToken || accessToken === null) {
          getQueryClient().removeQueries({ queryKey: ["members", "me"] });
          getQueryClient().removeQueries({ queryKey: ["favorites"] });
          getQueryClient().removeQueries({ queryKey: ["ratings"] });
        }
        set({ accessToken });
      },
    }),
    {
      name: "umcine-auth-store",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);
