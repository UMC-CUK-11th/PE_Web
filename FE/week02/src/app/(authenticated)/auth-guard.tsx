"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LoadingState } from "../../components/request-state";
import { useAuthStore } from "../../stores/auth-store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !accessToken) router.replace("/login");
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated || !accessToken) {
    return <main className="flex-1"><LoadingState message="로그인 정보를 확인하는 중이에요." /></main>;
  }

  return children;
}
