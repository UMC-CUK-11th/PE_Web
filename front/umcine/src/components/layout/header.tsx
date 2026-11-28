"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { useStorageReady } from "./app-providers";

const authLinkClassName =
  "inline-flex h-8 min-w-[72px] items-center justify-center rounded-[5px] bg-[#2f65dd] px-[11px] text-[11px] font-bold text-white no-underline";

const navigation = [
  { href: "/", label: "영화" },
  { href: "/search", label: "검색" },
  { href: "/my-page", label: "내 정보" },
];

export function Header() {
  const pathname = usePathname();
  const storageReady = useStorageReady();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#eceef2] bg-white px-6 md:px-12">
      <Link className="flex items-center gap-1.5 text-[13px] font-extrabold tracking-[-0.6px] text-[#141923] no-underline" href="/" aria-label="UMCine 홈">
        <Image width={20} height={20} className="h-5 w-5 rounded-md border-[1.5px] border-[#161b23] p-0.5" src="/icons/movie.svg" alt="" />
        <span>UMCine</span>
      </Link>
      <nav className="mr-auto ml-8 hidden items-center gap-[26px] md:flex" aria-label="주요 메뉴">
        {navigation.map(({ href, label }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} aria-current={isActive ? "page" : undefined}
              className={cn("text-xs font-semibold no-underline", isActive ? "text-[#252b35]" : "text-[#8b919c]")}>
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3">
        <Link className="grid h-[34px] w-[34px] place-items-center rounded-[7px] border border-[#dce0e6] bg-white p-1.5" href="/search" aria-label="검색">
          <Image width={18} height={18} src="/icons/search.svg" alt="" />
        </Link>
        {!storageReady || meQuery.isLoading ? (
          <span
            className="h-8 w-[72px] animate-pulse rounded-[5px] bg-gray-200"
            role="status"
            aria-label="내 정보 불러오는 중"
          />
        ) : accessToken ? (
          <Link href="/my-page" className={authLinkClassName}>마이페이지</Link>
        ) : (
          <Link href="/login" className={authLinkClassName}>로그인</Link>
        )}
      </div>
    </header>
  );
}
