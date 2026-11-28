"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";

const StorageReadyContext = createContext(false);

export function useStorageReady() {
  return useContext(StorageReadyContext);
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));
  const [storageReady, setStorageReady] = useState(false);
  const memberCheckStarted = useRef(false);

  useEffect(() => {
    let active = true;
    void Promise.allSettled([
      useAuthStore.persist?.rehydrate(),
      useBookmarkStore.persist?.rehydrate(),
    ]).then(() => {
      if (active) setStorageReady(true);
    });

    if (process.env.NODE_ENV === "development" && !memberCheckStarted.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("check-member-api") === "1") {
        memberCheckStarted.current = true;
        void import("@/examples/check-member-api").then(({ checkMemberApi }) => checkMemberApi(params));
      }
    }

    return () => { active = false; };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StorageReadyContext.Provider value={storageReady}>
        {children}
      </StorageReadyContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
