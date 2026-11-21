"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useAuthStore } from "../../stores/auth-store";

// 로그인하지 않은 사용자만 볼 수 있는 화면 (/login)
// 토큰은 브라우저 localStorage에만 있으니 서버가 아니라 여기(브라우저)에서 검사함
export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // localStorage를 다 읽기 전에는 토큰이 아직 null이라 판단하면 안 됨
    if (hydrated && accessToken) router.replace("/");
  }, [hydrated, accessToken, router]);

  if (!hydrated || accessToken) return null;
  return children;
}
