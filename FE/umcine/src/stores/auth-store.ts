import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { queryClient } from "../config/query-client";

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
          queryClient.removeQueries({ queryKey: ["members", "me"] });
          queryClient.removeQueries({ queryKey: ["favorites"] });
          queryClient.removeQueries({ queryKey: ["ratings"] });
        }
        set({ accessToken });
      },
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);
