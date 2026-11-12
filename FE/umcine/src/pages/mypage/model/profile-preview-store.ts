import { create } from "zustand";

// 7주차 퍼블리싱용 예시 데이터입니다. 실제 회원 정보/인증 상태와 분리합니다.
// 새로고침 시 예시 값으로 돌아가며 비밀번호나 토큰은 저장하지 않습니다.
export const useProfilePreviewStore = create<{
  nickname: string; email: string; setNickname: (nickname: string) => void;
}>((set) => ({
  nickname: "moviefan",
  email: "moviefan@example.com",
  setNickname: (nickname) => set({ nickname }),
}));
