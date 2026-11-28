import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  nickname: string;
  email: string;
  updateUser: (nickname: string, email: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      nickname: "UMC 사용자",
      email: "umc@example.com",
      updateUser: (nickname, email) => set({ nickname, email }),
    }),
    { name: "umc-user" },
  ),
);
