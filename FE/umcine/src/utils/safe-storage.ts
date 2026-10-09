import type { StateStorage } from "zustand/middleware";

/**
 * localStorage가 차단되거나 용량 제한으로 실패해도 Zustand 상태 변경이 중단되지 않게 합니다.
 * 브라우저 저장에 실패하면 현재 탭에서 사용할 수 있는 메모리 저장소로 대체합니다.
 */
const memoryStorage = new Map<string, string>();

export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      const storedValue = localStorage.getItem(name);
      if (storedValue !== null) memoryStorage.set(name, storedValue);
      return storedValue ?? memoryStorage.get(name) ?? null;
    } catch {
      return memoryStorage.get(name) ?? null;
    }
  },
  setItem: (name, value) => {
    // 메모리를 먼저 갱신하면 localStorage 쓰기가 실패해도 현재 화면의 상태는 유지됩니다.
    memoryStorage.set(name, value);
    try {
      localStorage.setItem(name, value);
    } catch {
      // 영구 저장만 포기하고 Zustand의 메모리 상태 변경은 계속 진행합니다.
    }
  },
  removeItem: (name) => {
    memoryStorage.delete(name);
    try {
      localStorage.removeItem(name);
    } catch {
      // 저장소 접근이 불가능해도 메모리에서는 제거된 상태를 유지합니다.
    }
  },
};
