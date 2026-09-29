import { Link } from "@tanstack/react-router";

const navLinkClass =
  "relative text-sm leading-6 font-medium text-[#555] no-underline";

const activeNavLinkClass =
  "relative text-sm leading-6 font-semibold text-[#111] no-underline after:absolute after:right-0 after:bottom-[-8px] after:left-0 after:h-0.5 after:bg-[#111] after:content-['']";

export function Header() {
  return (
    <header className="flex h-[57px] w-full items-center justify-between border-b border-[#e3e6eb] bg-white px-5 py-3 md:px-20 md:py-4">
      <div className="flex items-center gap-6 md:gap-12">
        <Link
          className="flex items-center gap-2 text-xl leading-none font-bold text-[#111] no-underline"
          to="/"
        >
          <img
            className="block h-6 w-6"
            src="/movie-icons/movie.svg"
            alt=""
          />
          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-8" aria-label="주요 메뉴">
          <Link
            className={navLinkClass}
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: activeNavLinkClass }}
          >
            영화
          </Link>

          <Link
            className={navLinkClass}
            to="/search"
            activeProps={{ className: activeNavLinkClass }}
          >
            검색
          </Link>

          <a className={navLinkClass} href="#">
            내 정보
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Link
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e3e6eb] bg-white p-0"
          to="/search"
          aria-label="영화 검색"
        >
          <img
            className="h-5 w-5"
            src="/movie-icons/search.svg"
            alt=""
          />
        </Link>

        <button
          className="h-10 cursor-pointer rounded-lg border-0 bg-[#3182f6] px-5 text-sm font-semibold text-white"
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
