import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PreviewProfile {
  nickname: string;
  email: string;
  avatarUrl: string | null;
}

interface MemberPreviewStore {
  profile: PreviewProfile;
  profilesByEmail: Record<string, Pick<PreviewProfile, "email" | "nickname">>;
  updateProfile: (profile: Partial<PreviewProfile>) => void;
}

// API 연결 전까지 이메일별 닉네임을 이 브라우저에 보관합니다.
// 비밀번호·토큰·프로필 이미지 파일은 저장하지 않습니다.
export const useMemberPreviewStore = create<MemberPreviewStore>()(persist((set) => ({
  profile: {
    nickname: "",
    email: "",
    avatarUrl: null,
  },
  profilesByEmail: {},
  updateProfile: (changes) => set((state) => {
    const email = (changes.email ?? state.profile.email).trim();
    const previousProfile = email === state.profile.email
      ? state.profile
      : state.profilesByEmail[email];
    const profile = {
      email,
      nickname: changes.nickname ?? previousProfile?.nickname ?? "",
      avatarUrl: changes.avatarUrl !== undefined
        ? changes.avatarUrl
        : email === state.profile.email ? state.profile.avatarUrl : null,
    };
    return {
      profile,
      profilesByEmail: email ? {
        ...state.profilesByEmail,
        [email]: { email, nickname: profile.nickname },
      } : state.profilesByEmail,
    };
  }),
}), {
  name: "umcine-member-preview",
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    profile: { email: state.profile.email, nickname: state.profile.nickname, avatarUrl: null },
    profilesByEmail: state.profilesByEmail,
  }),
}));
