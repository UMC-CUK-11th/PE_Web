"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";

function subscribe(callback: () => void) {
  return useAuthStore.persist?.onFinishHydration(callback) ?? (() => {});
}

function isHydrated() {
  return useAuthStore.persist?.hasHydrated() ?? true;
}

export function AuthenticatedLayout({ children, guestOnly = false }: {
  children: ReactNode;
  guestOnly?: boolean;
}) {
  const hydrated = useSyncExternalStore(subscribe, isHydrated, () => false);
  const token = useAuthStore((state) => state.accessToken);
  const router = useRouter();
  const canEnter = guestOnly ? !token : Boolean(token);

  useEffect(() => {
    if (hydrated && !canEnter) {
      router.replace(guestOnly ? "/" : "/login");
    }
  }, [hydrated, canEnter, guestOnly, router]);

  return hydrated && canEnter ? children : null;
}
