import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="w-full border-b-[3px] border-[#6094eb] bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-[1180px] flex-wrap items-center gap-y-3 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-6 sm:py-0">
        <div className="flex items-center gap-[7px]">
          <img className="h-[26px] w-[26px]" src="/icons/movie.svg" alt="" />
          <strong className="text-[17px] font-bold">UMCine</strong>
        </div>

        <nav className="order-last flex w-full items-center justify-center gap-5 text-[13px] sm:order-none sm:ml-[42px] sm:w-auto sm:gap-7">
          {/* Link를 사용하면 전체 문서를 새로 받지 않고 SPA 안에서 화면을 이동한다. */}
          <Link className="text-[#444] no-underline" to="/">
            영화
          </Link>
          <Link className="text-[#444] no-underline" to="/search">
            검색
          </Link>
          <Link className="text-[#444] no-underline" to="/members">
            회원
          </Link>
          <Link className="text-[#444] no-underline" to="/mypage">
            내 정보
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

          <Link to="/login" className="flex h-9 items-center rounded-[5px] bg-[#536be8] px-[14px] text-[13px] text-white">
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
