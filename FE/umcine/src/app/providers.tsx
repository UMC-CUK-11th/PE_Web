"use client";

import { useEffect, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "../config/query-client";
import { useAuthStore } from "../stores/auth-store";
import { useUiPreferenceStore } from "../stores/ui-preference-store";

export function Providers({ children }: { children: ReactNode }) {
  const client = getQueryClient();
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useUiPreferenceStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
