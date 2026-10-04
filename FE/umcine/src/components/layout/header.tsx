import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="w-full border-b-[3px] border-[#6094eb] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center px-6">
        <div className="flex items-center gap-[7px]">
          <img className="h-[26px] w-[26px]" src="/icons/movie.svg" alt="" />
          <strong className="text-[17px] font-bold">UMCine</strong>
        </div>

        <nav className="ml-[42px] flex items-center gap-7 text-[13px]">
          {/* Link를 사용하면 전체 문서를 새로 받지 않고 SPA 안에서 화면을 이동한다. */}
          <Link className="text-[#444] no-underline" to="/">
            영화
          </Link>
          <Link className="text-[#444] no-underline" to="/search">
            검색
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#dddddd] bg-white"
            to="/search"
            aria-label="검색"
          >
            <img className="h-[17px] w-[17px]" src="/icons/search.svg" alt="" />
          </Link>

          <button className="h-9 rounded-[5px] bg-[#536be8] px-[14px] text-[13px] text-white">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
