import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "../utils/cn";

export function Header() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchRoute = pathname === "/search";

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-[#e7e8ec] bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1264px] items-center px-4 md:px-8">
        <Link className="mr-7 flex items-center gap-2 text-sm font-extrabold tracking-[-0.4px] text-[#17181c] no-underline" to="/" aria-label="UMCine 영화 목록">
          <span className="grid size-6 place-items-center rounded-[5px] bg-[#17181c]">
            <img className="size-4 invert" src="/icons/movie-icons/movie-icons/movie.svg" alt="" />
          </span>
          UMCine
        </Link>

        <nav className="flex h-full items-center gap-5 text-xs font-semibold text-[#8b8d94]" aria-label="주요 메뉴">
          <Link
            className={cn(
              "relative flex h-full items-center transition-colors hover:text-[#17181c]",
              isMovieRoute && "text-[#17181c] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-[#2563eb]",
            )}
            to="/"
          >
            영화
          </Link>
          <span className="hidden sm:inline">랭킹</span>
          <span className="hidden sm:inline">내 정보</span>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            className={cn(
              "grid size-8 place-items-center rounded-md transition-colors hover:bg-[#f0f1f4]",
              isSearchRoute && "bg-[#eef3ff] ring-1 ring-[#2563eb]/20",
            )}
            to="/search"
            search={{}}
            aria-label="영화 검색"
          >
            <img className="size-4" src="/icons/movie-icons/movie-icons/search.svg" alt="" />
          </Link>
          <button className="h-8 rounded-md bg-[#2563eb] px-3 text-[11px] font-bold text-white transition hover:bg-[#1d4ed8]" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
