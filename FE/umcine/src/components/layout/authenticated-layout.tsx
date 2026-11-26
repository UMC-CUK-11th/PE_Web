"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../stores/auth-store";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) {
    return (
      <main role="status" className="min-h-[65vh] p-12 text-center">
        로그인 상태 확인 중…
      </main>
    );
  }
  return children;
}
