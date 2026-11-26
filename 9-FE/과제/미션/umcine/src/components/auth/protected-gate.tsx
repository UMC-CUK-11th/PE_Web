"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";

// 토큰은 브라우저의 localStorage에만 있어서 로그인 여부는 브라우저에서 판단한다
export function ProtectedGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  // 보고 있는 중에 401로 토큰이 비워져도 로그인 화면으로 보낸다
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  // 저장된 토큰을 읽기 전에는 로그인 화면으로 보내지도, 보호된 화면을 그리지도 않는다
  if (!hydrated || !accessToken) return null;
  return children;
}
