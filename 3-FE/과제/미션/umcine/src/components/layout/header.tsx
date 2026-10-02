import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const items = [
    { to: "/" as const, label: "영화" },
    { to: "/search" as const, label: "검색" },
  ];
  return (
    <header className="border-b border-[#e9eaf0] bg-white">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center gap-x-8 px-5 pt-4 sm:min-h-[90px] sm:px-10 sm:pt-0">
        <Link
          to="/"
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
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
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
          <span className="flex items-center text-[#6a7081]">내 정보</span>
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <Link to="/search" aria-label="영화 검색으로 이동">
            <img src="/icons/search.svg" alt="" className="size-5" />
          </Link>
          <span className="rounded bg-[#235ce8] px-4 py-2.5 text-xs font-semibold text-white">
            로그인
          </span>
        </div>
      </div>
    </header>
  );
}
