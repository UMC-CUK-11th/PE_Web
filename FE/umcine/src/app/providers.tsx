"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient, getBrowserQueryClient } from "../query-client";
import { useAuthStore } from "../stores/auth-store";
import { useDisplayPreferencesStore } from "../stores/display-preferences-store";
import { useBookmarkStore } from "../stores/bookmark-store";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => typeof window === "undefined" ? createQueryClient() : getBrowserQueryClient());
  useEffect(() => {
    void useDisplayPreferencesStore.persist.rehydrate();
    void useBookmarkStore.persist.rehydrate();
    void Promise.resolve(useAuthStore.persist.rehydrate()).finally(() => useAuthStore.setState({ hydrated: true }));
    function sync(event: StorageEvent) {
      if (event.key === null || event.key === "umcine-auth-store" && event.newValue === null) {
        useAuthStore.getState().setAccessToken(null);
      } else if (event.key === "umcine-auth-store") {
        void useAuthStore.persist.rehydrate();
      }
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  return <QueryClientProvider client={client}>
    {children}
    {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>;
}
