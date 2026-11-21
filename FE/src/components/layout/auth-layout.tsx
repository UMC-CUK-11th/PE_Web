"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지들의 공통 레이아웃: 하위 페이지를 children으로 그림
export function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  // 페이지를 보는 중에 401로 토큰이 지워져도 다시 그려지면서 로그인 화면으로 보냄
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // 새로고침 직후엔 localStorage를 읽기 전이라 토큰이 잠깐 null → hydration이 끝난 뒤에만 판단
    if (hydrated && !accessToken) router.replace("/login");
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) {
    return <main className="mx-auto max-w-lg px-6 py-10 text-sm text-gray-500" role="status">로그인 정보를 확인하는 중이에요.</main>;
  }
  return children;
}
