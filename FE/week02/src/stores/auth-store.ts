"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthSession {
  accessToken: string;
  nickname: string;
  memberId: number | null;
}

interface AuthStore extends AuthSession {
  hasHydrated: boolean;
  setSession: (session: Pick<AuthSession, "accessToken" | "nickname">) => void;
  clearSession: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const EMPTY_SESSION: AuthSession = {
  accessToken: "",
  nickname: "",
  memberId: null,
};

function getMemberIdFromToken(accessToken: string) {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) return null;

    const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalizedPayload = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, "=");
    const decodedPayload = JSON.parse(atob(normalizedPayload)) as { sub?: string };
    const memberId = Number(decodedPayload.sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...EMPTY_SESSION,
      hasHydrated: false,
      setSession: ({ accessToken, nickname }) =>
        set({ accessToken, nickname, memberId: getMemberIdFromToken(accessToken) }),
      clearSession: () => set(EMPTY_SESSION),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ accessToken, nickname, memberId }) => ({ accessToken, nickname, memberId }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
