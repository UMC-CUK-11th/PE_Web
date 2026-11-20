import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

const navClassName = (isActive: boolean) =>
  cn(
    "relative flex h-full items-center text-sm font-medium text-[#5e636c] no-underline",
    "after:absolute after:inset-x-0 after:bottom-[27px] after:h-px after:bg-[#18191b] after:content-none max-sm:after:bottom-[3px]",
    isActive && "font-bold text-[#18191b] after:content-['']",
  );

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const nickname = useAuthStore((state) => state.nickname);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchRoute = pathname === "/search";
  const isProfileRoute = pathname.startsWith("/my");

  return (
    <header className="h-[88px] shrink-0 border-b border-[#e8ebef] bg-white max-sm:h-auto">
      <div className="mx-auto flex h-full w-[min(calc(100%-48px),1200px)] items-center max-sm:min-h-[72px] max-sm:flex-wrap max-sm:py-2 max-[420px]:w-[calc(100%-32px)]">
        <Link className="inline-flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-0.5px] text-[#18191b] no-underline" to="/" aria-label="UMCine 홈">
          <img className="size-8" src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </Link>
        <nav className="ml-[43px] flex h-full items-center gap-[34px] max-sm:order-3 max-sm:ml-0 max-sm:h-[38px] max-sm:w-full max-[420px]:gap-6" aria-label="주요 메뉴">
          <Link className={navClassName(isMovieRoute)} to="/" aria-current={isMovieRoute ? "page" : undefined}>영화</Link>
          <Link className={navClassName(isSearchRoute)} to="/search" aria-current={isSearchRoute ? "page" : undefined}>검색</Link>
          <Link className={navClassName(isProfileRoute)} to="/my" aria-current={isProfileRoute ? "page" : undefined}>내 정보</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link className="grid size-11 place-items-center rounded-lg border border-[#e1e5ea] bg-white" to="/search" aria-label="영화 검색">
            <img className="size-5" src="/icons/search.svg" alt="" />
          </Link>
          {accessToken ? (
            <button
              className="h-11 cursor-pointer rounded-lg border-0 bg-[#18191b] px-[18px] text-sm font-bold text-white"
              type="button"
              title={`${nickname} 로그아웃`}
              onClick={() => {
                clearSession();
                queryClient.removeQueries({ queryKey: ["member"] });
                queryClient.removeQueries({ queryKey: ["favorites"] });
                queryClient.removeQueries({ queryKey: ["ratings"] });
                void navigate({ to: "/" });
              }}
            >
              로그아웃
            </button>
          ) : (
            <Link className="inline-flex h-11 items-center rounded-lg bg-[#2877eb] px-[18px] text-sm font-bold text-white no-underline" to="/login">로그인</Link>
          )}
        </div>
      </div>
    </header>
  );
}
