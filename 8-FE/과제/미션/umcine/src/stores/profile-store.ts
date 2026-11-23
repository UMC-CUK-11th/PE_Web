import { create } from "zustand";

// 프로필 이미지를 저장하는 API가 없어서 이미지는 화면끼리만 주고받는다
interface ProfileStore {
  imageUrl: string | null;
  setImageUrl: (imageUrl: string | null) => void;
}

export const useProfileStore = create<ProfileStore>()((set) => ({
  imageUrl: null,
  setImageUrl: (imageUrl) => set({ imageUrl }),
}));
