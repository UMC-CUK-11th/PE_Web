import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthSession {
  accessToken: string;
  memberId: number;
  email: string;
  nickname: string;
}

interface AuthStore {
  session: AuthSession | null;
  sessionMessage: string | null;
  setSession: (session: AuthSession) => void;
  clearSession: (message?: string) => void;
}

// 비밀번호는 보관하지 않습니다. 토큰은 현재 브라우저 탭에서만 유지합니다.
export const useAuthStore = create<AuthStore>()(persist(
  (set) => ({
    session: null,
    sessionMessage: null,
    setSession: (session) => set({ session, sessionMessage: null }),
    clearSession: (message) => set({ session: null, sessionMessage: message ?? null }),
  }),
  {
    name: "umcine-auth-session",
    storage: createJSONStorage(() => sessionStorage),
    partialize: (state) => ({ session: state.session }),
  },
));
