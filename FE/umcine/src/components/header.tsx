"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { meOptions } from "../api/private-query-options";
export function Header() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.accessToken);
  const me = useQuery(meOptions());
  return <header className="sticky top-0 z-50 h-14 border-b border-slate-200 bg-white"><div className="mx-auto flex h-full max-w-[1264px] items-center px-4 md:px-8">
    <Link href="/" aria-label="UMCine 영화 목록" className="mr-3 flex shrink-0 items-center gap-2 text-sm font-extrabold sm:mr-7"><span className="grid size-6 place-items-center rounded bg-slate-950"><img className="size-4 invert" src="/icons/movie-icons/movie-icons/movie.svg" alt="" /></span>UMCine</Link>
    <nav aria-label="주요 메뉴" className="flex gap-4 text-xs font-semibold text-slate-500"><Link href="/" className={pathname === "/" ? "text-blue-600" : ""}>영화</Link><Link href="/members" className="hidden sm:inline">회원·평점</Link></nav>
    <div className="ml-auto flex items-center gap-2"><Link href="/search" aria-label="영화 검색" className="grid size-8 place-items-center rounded hover:bg-slate-100"><img className="size-4" src="/icons/movie-icons/movie-icons/search.svg" alt="" /></Link>
      {!token ? <Link href="/login" className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">로그인</Link>
        : <><Link href="/mypage" className="rounded-lg px-2 py-2 text-xs font-bold text-blue-700">{me.isLoading ? "확인 중…" : <><span className="hidden sm:inline">{me.data?.nickname} · </span>내 정보</>}</Link><button type="button" className="rounded-lg border border-slate-200 px-2 py-2 text-xs text-slate-600" onClick={() => useAuthStore.getState().setAccessToken(null)}>로그아웃</button></>}
    </div>
  </div></header>;
}
