"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "../stores/auth-store";
import { useBookmarkStore } from "../stores/bookmark-store";

// QueryClientProvider는 Context(브라우저 상태)를 쓰기 때문에 Client Component에서만 쓸 수 있음
// 그래서 layout.tsx(Server Component)가 아니라 이 "use client" 파일에서 감쌈
export function Providers({ children }: { children: ReactNode }) {
  // QueryClient를 파일 맨 위(모듈)에서 만들면 서버에서는 모든 사용자가 같은 캐시를 같이 쓰게 됨
  // useState로 만들면 컴포넌트가 처음 그려질 때 한 번만 만들어지고, 다시 그려져도 그대로 유지됨
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      }),
  );

  // 서버 HTML에는 localStorage 값이 없으므로, 화면이 브라우저에 붙은 뒤(useEffect)에 저장값을 읽어 옴
  // (store에서 skipHydration: true로 자동 읽기를 꺼 둠)
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
