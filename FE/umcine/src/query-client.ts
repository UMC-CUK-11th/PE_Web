import { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./stores/auth-store";

export const queryClient = new QueryClient({ defaultOptions: {
  queries: { staleTime: 60_000, gcTime: 300_000 },
  mutations: { retry: false },
} });

// 계정 변경/로그아웃/401 직후 개인 캐시를 지웁니다. 영화 공개 캐시는 유지합니다.
useAuthStore.subscribe((state, previous) => {
  if (state.accessToken === previous.accessToken) return;
  const filter = { predicate: (query: { queryKey: readonly unknown[] }) =>
    query.queryKey[0] === "private" || query.queryKey[0] === "members" && query.queryKey[1] === "me" };
  void queryClient.cancelQueries(filter);
  queryClient.removeQueries(filter);
});
