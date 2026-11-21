"use client";

import Link from "next/link";
import { useAuthHydrated } from "../../hooks/use-auth-hydrated";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthStore } from "../../stores/auth-store";

export function Header() {
  // 서버 HTML과 브라우저 첫 화면을 똑같이(로딩 표시) 그리고, localStorage를 읽은 뒤에 로그인/마이페이지를 보여 줌
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="text-xl font-bold text-black no-underline"
          >
            UMCine
          </Link>

          <nav className="flex items-center gap-4 text-sm sm:gap-6">
            <Link
              href="/"
              className="text-black no-underline"
            >
              영화
            </Link>

            <Link
              href="/search"
              className="text-black no-underline"
            >
              검색
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-black no-underline"
          >
            🔍
          </Link>

          {hydrated && !accessToken ? (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline"
            >
              로그인
            </Link>
          ) : !hydrated || meQuery.isLoading ? (
            <span className="h-9 w-24 animate-pulse rounded-md bg-gray-200" aria-label="내 정보 불러오는 중" />
          ) : (
            <Link
              href="/my"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
