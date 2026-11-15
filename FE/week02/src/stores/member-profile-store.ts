import { create } from "zustand";

export interface MemberProfile {
  email: string;
  nickname: string;
  introduction: string;
}

interface MemberProfileState {
  profile: MemberProfile;
  updateProfile: (profile: MemberProfile) => void;
}

export const useMemberProfileStore = create<MemberProfileState>((set) => ({
  profile: {
    email: "umcine@example.com",
    nickname: "영화로운생활",
    introduction: "새로운 영화를 발견하고 기록하는 것을 좋아해요.",
  },
  updateProfile: (profile) => set({ profile }),
}));
