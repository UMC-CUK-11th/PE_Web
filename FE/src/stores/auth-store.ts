import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create<{
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}>()(
  persist(set => ({
    accessToken: null,
    setAccessToken: accessToken => set({ accessToken }),
  }), {
    name: "umcine-auth-store",
    storage: createJSONStorage(() => localStorage),
    partialize: state => ({ accessToken: state.accessToken }),
  }),
);

// 공개 회원별 평점 조회에 필요한 ID만 읽는다. 인증과 소유권 검사는 서버가 수행한다.
export function getTokenMemberId(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const memberId = Number(JSON.parse(atob(payload)).sub);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
