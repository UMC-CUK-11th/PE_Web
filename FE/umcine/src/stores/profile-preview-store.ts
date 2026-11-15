import { create } from "zustand";

// 화면 퍼블리싱용 예시 데이터. 서버에서 조회한 회원 정보와 구분한다.
export const useProfilePreviewStore = create<{
  email: string; nickname: string; createdAt: string; setNickname: (nickname: string) => void;
}>((set) => ({
  email: "movie@example.com", nickname: "영화광", createdAt: "2026-11-11",
  setNickname: (nickname) => set({ nickname }),
}));
