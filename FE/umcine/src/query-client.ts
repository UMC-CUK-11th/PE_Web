import { QueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./stores/auth-store";

export function createQueryClient() {
  return new QueryClient({ defaultOptions: {
    queries: { staleTime: 60_000, gcTime: 300_000 },
    mutations: { retry: false },
  } });
}

let browserClient: QueryClient | undefined;
export function getBrowserQueryClient() {
  if (!browserClient) {
    const client = createQueryClient();
    useAuthStore.subscribe((state, previous) => {
      if (state.accessToken === previous.accessToken) return;
      const filter = { predicate: (query: { queryKey: readonly unknown[] }) =>
        query.queryKey[0] === "private" || query.queryKey[0] === "members" && query.queryKey[1] === "me" };
      void client.cancelQueries(filter);
      client.removeQueries(filter);
    });
    browserClient = client;
  }
  return browserClient;
}
