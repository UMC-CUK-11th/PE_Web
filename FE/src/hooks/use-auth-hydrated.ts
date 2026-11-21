import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

// localStorage에서 토큰을 다 읽었는지(hydration 완료) 알려 줌
// - 서버 렌더링, 브라우저 첫 렌더링: 항상 false (서버 HTML과 화면이 똑같아야 hydration 경고가 안 남)
// - Providers의 rehydrate()가 끝나면 true로 바뀌고 컴포넌트가 다시 그려짐
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
