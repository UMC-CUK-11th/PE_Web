
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useMemberInfo } from "../../hooks/use-member-info";
import { useAuthStore } from "../../stores/auth-store";

const memberLinkClass =
  "rounded text-slate-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4";

function navClass(active: boolean) {
  return active
    ? "rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
    : "rounded-xl px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-slate-700/50 hover:text-white";
}

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const member = useMemberInfo();
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    useAuthStore.getState().setAccessToken(null);
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#26344c] bg-[#0b1120]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="UMCine 홈"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 text-xl font-black text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:scale-105">
            U
          </div>

          <div className="flex items-baseline">
            <span className="text-2xl font-black tracking-tight text-white">
              UMC
            </span>
            <span className="text-2xl font-black tracking-tight text-blue-400">
              ine
            </span>
          </div>
        </Link>

        {process.env.NODE_ENV === "development" && (
          <Link
            href="/api-test"
            className="text-xs font-medium text-slate-400"
          >
            API 확인
          </Link>
        )}

        <nav
          aria-label="메인 메뉴"
          className="flex items-center gap-1 rounded-2xl border border-[#26344c] bg-[#162238] p-1.5"
        >
          <Link
            href="/"
            className={navClass(pathname === "/")}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            영화
          </Link>

          <Link
            href="/search"
            className={navClass(pathname === "/search")}
            aria-current={
              pathname === "/search" ? "page" : undefined
            }
          >
            검색
          </Link>

          <Link
            href={accessToken ? "/my#favorites" : "/login"}
            className={navClass(false)}
          >
            북마크
          </Link>
        </nav>

        <nav
          aria-label="회원 메뉴"
          className="flex w-full items-center justify-end gap-4 text-xs sm:w-auto"
        >
          {accessToken ? (
            <>
              {member.isLoading ? (
                <span
                  role="status"
                  className="flex items-center gap-2 text-slate-400"
                >
                  <span
                    aria-hidden="true"
                    className="cinema-spinner h-4 w-4"
                  />
                  회원 정보 로딩 중
                </span>
              ) : (
                <Link href="/my" className={memberLinkClass}>
                  {member.data
                    ? member.data.nickname + "님"
                    : "내 정보"}
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 transition hover:bg-slate-800"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={memberLinkClass}>
                로그인
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
