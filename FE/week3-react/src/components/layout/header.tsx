import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="h-[76px] border-b border-[#eceef2] bg-white" id="top">
      <div className="mx-auto grid h-full w-[min(calc(100%-80px),1200px)] grid-cols-[1fr_auto_1fr] items-center">
        <Link
          className="inline-flex w-max items-center gap-[9px] text-lg font-extrabold tracking-[-0.4px] text-[#15171c] no-underline"
          to="/"
          aria-label="UMCine 홈"
        >
          <span
            className="grid size-7 place-items-center overflow-hidden rounded-[7px] border-2 border-[#17191f]"
            aria-hidden="true"
          >
            <img className="size-5" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-[42px]" aria-label="주요 메뉴">
          <Link
            className="py-[27px] text-sm font-semibold text-[#1a1c22] no-underline"
            to="/"
          >
            영화
          </Link>
          <span className="py-[27px] text-sm font-semibold text-[#7b808b]">
            리뷰
          </span>
          <span className="py-[27px] text-sm font-semibold text-[#7b808b]">
            내 정보
          </span>
        </nav>

        <div className="flex items-center justify-self-end gap-[18px]">
          <Link
            className="grid size-9 place-items-center rounded-full hover:bg-[#f2f4f7] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-500/35"
            to="/search"
            aria-label="영화 검색"
          >
            <img
              className="size-[22px] opacity-60"
              src="/icons/search.svg"
              alt=""
            />
          </Link>
          <button
            className="h-9 min-w-[68px] cursor-pointer rounded-md bg-[#2669ee] px-4 text-[13px] font-bold text-white hover:bg-[#1559dd]"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
