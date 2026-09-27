import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="h-[86px] border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-full w-[min(1210px,calc(100%-64px))] items-center">
        <div className="flex items-center gap-[9px] text-[20px] font-extrabold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#191919] text-[14px]">
            ▣
          </span>
          <span>UMCine</span>
        </div>

        <nav className="ml-[55px] flex gap-[30px]">
          <Link
            to="/"
            className="text-[14px] font-bold text-[#191919] underline underline-offset-[6px]"
          >
            영화
          </Link>

          <Link
            to="/search"
            className="text-[14px] text-[#737780] no-underline"
          >
            검색
          </Link>

          <a href="#" className="text-[14px] text-[#737780] no-underline">
            내 정보
          </a>
        </nav>

        <div className="ml-auto flex gap-3">
          <button
            className="flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[9px] border border-[#e1e4e8] bg-white"
            type="button"
          >
            <img className="h-5 w-5" src="/icons/search.svg" alt="검색" />
          </button>

          <button
            className="h-[42px] cursor-pointer rounded-lg border-0 bg-[#2878f0] px-5 font-bold text-white"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
