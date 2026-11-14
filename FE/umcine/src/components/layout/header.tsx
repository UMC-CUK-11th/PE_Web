import { Link, useNavigate } from "@tanstack/react-router";

import { useMemberInfo } from "../../hooks/use-member-info";
import { useAuthStore } from "../../stores/auth-store";

const memberLinkClass =
  "rounded hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-4";

export default function Header() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const member = useMemberInfo();
  const navigate = useNavigate();

  async function logout() {
    useAuthStore.getState().setAccessToken(null);
    await navigate({ to: "/", replace: true });
  }
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2"
          aria-label="UMCine 홈"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-lg font-black text-white shadow-sm transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
            U
          </div>

          <div className="flex items-baseline">
            <span className="text-[24px] font-black tracking-[-0.06em] text-zinc-950">
              UMC
            </span>
            <span className="text-[24px] font-black tracking-[-0.06em] text-zinc-500">
              ine
            </span>
          </div>
        </Link>

        {/* Navigation */}
        {import.meta.env.DEV && (
          <Link to="/api-test" className="text-xs font-medium text-zinc-500">
            API 확인
          </Link>
        )}
        <nav className="flex items-center gap-2 rounded-2xl bg-zinc-100 p-1.5">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className:
                "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-sm",
            }}
            inactiveProps={{
              className:
                "rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/70 hover:text-zinc-900",
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            activeProps={{
              className:
                "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-sm",
            }}
            inactiveProps={{
              className:
                "rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/70 hover:text-zinc-900",
            }}
          >
            검색
          </Link>

          <Link
            to={accessToken ? "/my" : "/login"}
            hash={accessToken ? "favorites" : undefined}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/70 hover:text-zinc-900"
          >
            북마크
          </Link>
        </nav>
        <nav
          aria-label="회원 메뉴"
          className="flex w-full justify-end gap-4 text-xs text-zinc-600 sm:w-auto"
        >
          {accessToken ? (
            <>
              {member.isLoading ? (
                <span role="status" className="animate-pulse">
                  회원 정보 불러오는 중
                </span>
              ) : (
                <Link to="/my" className={memberLinkClass}>
                  {member.data ? member.data.nickname + "님" : "내 정보"}
                </Link>
              )}
              <button
                type="button"
                className={memberLinkClass}
                onClick={() => void logout()}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={memberLinkClass}>
                로그인
              </Link>
              <Link to="/signup" className={memberLinkClass}>
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
