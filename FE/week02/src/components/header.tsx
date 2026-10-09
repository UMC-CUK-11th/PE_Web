import { Link, useLocation } from "react-router-dom";
import { cn } from "../utils/cn";

const navClassName = (isActive: boolean) =>
  cn(
    "relative flex h-full items-center text-sm font-medium text-[#5e636c] no-underline",
    "after:absolute after:inset-x-0 after:bottom-[27px] after:h-px after:bg-[#18191b] after:content-none max-sm:after:bottom-[3px]",
    isActive && "font-bold text-[#18191b] after:content-['']",
  );

export function Header() {
  const { pathname } = useLocation();
  const isMovieRoute = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchRoute = pathname === "/search";

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
          <a className="flex h-full items-center text-sm font-medium text-[#5e636c] no-underline" href="#profile">내 정보</a>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link className="grid size-11 place-items-center rounded-lg border border-[#e1e5ea] bg-white" to="/search" aria-label="영화 검색">
            <img className="size-5" src="/icons/search.svg" alt="" />
          </Link>
          <button className="h-11 cursor-pointer rounded-lg border-0 bg-[#2877eb] px-[18px] text-sm font-bold text-white" type="button">로그인</button>
        </div>
      </div>
    </header>
  );
}
