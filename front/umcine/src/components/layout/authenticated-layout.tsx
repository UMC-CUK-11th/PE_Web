"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "../../stores/auth-store";
import { useStorageReady } from "./app-providers";

export function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const storageReady = useStorageReady();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (storageReady && !accessToken) router.replace("/login");
  }, [accessToken, router, storageReady]);

  if (!storageReady || !accessToken) {
    return <p role="status" className="py-12 text-center text-sm text-[#747b86]">로그인 상태를 확인하고 있어요.</p>;
  }

  return children;
}
