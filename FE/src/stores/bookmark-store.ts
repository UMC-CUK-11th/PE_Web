// 이 파일은 여러 화면이 함께 쓰는 북마크 상태의 단일 관리 장소다.
// 목록·검색·상세 페이지가 같은 ID 목록을 읽고, 새로고침 후에도 상태를 복원한다.
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BookmarkState = {
  // 영화 객체 전체 대신 ID만 저장한다. 영화 정보는 movies 데이터에서 다시 찾는다.
  bookmarkIds: number[];
  toggleBookmark: (movieId: number) => void;
  isBookmarked: (movieId: number) => boolean;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      // 저장 데이터가 없거나 초기화되면 북마크가 없는 상태에서 시작한다.
      bookmarkIds: [],

      // get()으로 현재 ID 목록을 읽고, set()으로 변경된 새 배열을 저장한다.
      toggleBookmark: (movieId) => {
        const { bookmarkIds } = get();
        const isAlreadyBookmarked = bookmarkIds.includes(movieId);

        set({
          bookmarkIds: isAlreadyBookmarked
            ? bookmarkIds.filter((id) => id !== movieId)
            : [...bookmarkIds, movieId],
        });
      },

      // 버튼이 전달한 영화 ID가 현재 북마크 목록에 있는지 확인한다.
      isBookmarked: (movieId) => get().bookmarkIds.includes(movieId),
    }),
    {
      // persist가 이 키 아래에 상태를 저장하고 앱 시작 시 다시 읽는다.
      name: "umcine-bookmark-store",
      storage: createJSONStorage(() => localStorage),
      // 함수는 저장할 필요가 없으므로 ID 배열만 localStorage에 남긴다.
      partialize: (state) => ({
        bookmarkIds: state.bookmarkIds,
      }),
    },
  ),
);
