"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "../stores/auth-store";

function subscribe(callback: () => void) {
  const stopHydrate = useAuthStore.persist.onHydrate(callback);
  const stopFinish = useAuthStore.persist.onFinishHydration(callback);
  return () => {
    stopHydrate();
    stopFinish();
  };
}

export function useAuthHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
