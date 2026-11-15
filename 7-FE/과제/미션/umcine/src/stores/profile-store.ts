import { create } from "zustand";

// 내 정보 조회와 수정 API는 8주차에 연결한다. 그때까지 화면끼리 값을 주고받는 임시 저장소
interface Profile {
  nickname: string;
  email: string;
  imageUrl: string | null;
}

interface ProfileStore {
  profile: Profile;
  updateProfile: (changes: Pick<Profile, "nickname" | "imageUrl">) => void;
}

export const useProfileStore = create<ProfileStore>()((set) => ({
  profile: { nickname: "moviefan", email: "umc@example.com", imageUrl: null },
  updateProfile: (changes) => set((state) => ({ profile: { ...state.profile, ...changes } })),
}));
