"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isHTTPError } from "ky";
import { useState, type ReactNode } from "react";

const ONE_MINUTE = 60 * 1000;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_MINUTE,
        // 404, 401은 다시 요청해도 결과가 같으니 재시도하지 않는다
        retry: (failureCount, error) =>
          !(isHTTPError(error) && error.response.status < 500) && failureCount < 3,
      },
    },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  // 모듈 최상단에서 만들면 서버에서는 여러 요청이 같은 캐시를 나눠 쓰게 되어 컴포넌트마다 한 번만 만든다
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
