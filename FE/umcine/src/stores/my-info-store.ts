import { create } from "zustand";

interface MyInfo {
  nickname: string;
  email: string;
  // 브라우저에서 고른 이미지의 미리보기 주소예요. 없으면 기본 아이콘을 보여줘요.
  profileImageUrl: string | null;
}

interface MyInfoStore {
  myInfo: MyInfo;
  updateMyInfo: (next: Pick<MyInfo, "nickname" | "profileImageUrl">) => void;
}

// 7주차는 화면 퍼블리싱 단계라 임시 데이터를 써요.
// 8주차에 GET /members/me, PATCH /members/me 응답으로 바꿀 예정이에요.
const MOCK_MY_INFO: MyInfo = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
  profileImageUrl: null,
};

export const useMyInfoStore = create<MyInfoStore>((set) => ({
  myInfo: MOCK_MY_INFO,
  updateMyInfo: (next) => set((state) => ({ myInfo: { ...state.myInfo, ...next } })),
}));
