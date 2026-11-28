"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMeQuery } from "../../hooks/use-me-query";
import { useAuthHydrated, useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

// 현재 주소와 로그인 상태에 따라 바뀌어서 Client Component로 둔다
export function Header() {
  const pathname = usePathname();
  const hydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useMeQuery();
  const items = [
    { to: "/", label: "영화" },
    { to: "/search", label: "검색" },
    { to: "/my", label: "내 정보" },
  ];
  return (
    <header className="border-b border-[#e9eaf0] bg-white">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center gap-x-8 px-5 pt-4 sm:min-h-[90px] sm:px-10 sm:pt-0">
        <Link
          href="/"
          aria-label="UMCine 영화 목록"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <img src="/icons/movie.svg" alt="" className="size-6.5" />
          UMCine
        </Link>
        <nav
          aria-label="주 메뉴"
          className="order-3 flex h-14 w-full items-stretch gap-8 text-sm font-semibold sm:order-none sm:h-[90px] sm:w-auto"
        >
          {items.map((item) => {
            // 내 정보 수정(/my/edit)에서도 내 정보 메뉴를 활성화한다
            const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                href={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center border-b-3 border-transparent",
                  active && "border-[#171b25]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <Link href="/search" aria-label="영화 검색으로 이동">
            <img src="/icons/search.svg" alt="" className="size-5" />
          </Link>
          {hydrated && !accessToken ? (
            <Link href="/login" className="rounded bg-[#235ce8] px-4 py-2.5 text-xs font-semibold text-white">
              로그인
            </Link>
          ) : !hydrated || meQuery.isLoading ? (
            // 저장된 토큰을 읽기 전이나 첫 조회 중에는 버튼 크기의 자리만 잡아 둔다
            <span role="status" aria-label="내 정보 확인 중" className="h-[34px] w-[74px] animate-pulse rounded bg-[#e3e5eb]" />
          ) : (
            <Link href="/my" className="rounded bg-[#235ce8] px-4 py-2.5 text-xs font-semibold text-white">
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
