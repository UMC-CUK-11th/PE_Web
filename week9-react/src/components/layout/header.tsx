"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";

function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return (
    <header className="h-[86px] border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-full w-[min(1210px,calc(100%-64px))] items-center">
        <div className="flex items-center gap-[9px] text-[20px] font-extrabold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#191919] text-[14px]">
            🎬
          </span>
          <span>UMCine</span>
        </div>

        <nav className="ml-[55px] flex gap-[30px]">
          <Link href="/" className="text-[14px] font-bold text-[#191919] underline underline-offset-[6px]">
            영화
          </Link>
          <Link href="/search" className="text-[14px] text-[#737780] no-underline">
            검색
          </Link>
          <Link href="/mypage" className="text-[14px] text-[#737780] no-underline">
            내 정보
          </Link>
        </nav>

        <div className="ml-auto flex gap-3">
          <Link
            href="/search"
            className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[9px] border border-[#e1e4e8] bg-white"
          >
            <img className="h-5 w-5" src="/icons/search.svg" alt="검색" />
          </Link>

          {!accessToken ? (
            <Link
              href="/login"
              className="flex h-[42px] items-center rounded-lg bg-[#2878f0] px-5 font-bold text-white"
            >
              로그인
            </Link>
          ) : meQuery.isLoading ? (
            <span className="h-[42px] w-[100px] animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <Link
              href="/mypage"
              className="flex h-[42px] items-center rounded-lg bg-[#2878f0] px-5 font-bold text-white"
            >
              마이페이지
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
