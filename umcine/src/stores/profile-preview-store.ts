import { create } from "zustand";

interface ProfilePreviewStore {
  nickname: string;
  email: string;
  avatar: string;
  updateProfile: (nickname: string, avatar: string) => void;
}

export const useProfilePreviewStore = create<ProfilePreviewStore>((set) => ({
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
  avatar: "",
  updateProfile: (nickname, avatar) => set({ nickname, avatar }),
}));
