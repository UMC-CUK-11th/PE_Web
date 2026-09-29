import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
        <Link to="/" aria-label="UMCine 홈" className="flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
          <img src="/icons/movie.svg" alt="" className="size-7" />
          <strong className="text-xl font-extrabold tracking-tight">UMCine</strong>
        </Link>
        <nav aria-label="주 메뉴" className="flex items-center gap-5 text-sm font-semibold sm:gap-7">
          <Link to="/" activeOptions={{ exact: true }} className="rounded py-2 text-slate-500 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600" activeProps={{ className: "text-blue-700" }}>영화</Link>
          <Link to="/search" className="rounded py-2 text-slate-500 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600" activeProps={{ className: "text-blue-700" }}>검색</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link to="/search" aria-label="영화 검색" className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600">
            <img src="/icons/search.svg" alt="" className="size-5" />
          </Link>
          <button type="button" disabled title="로그인은 이후 주차에서 구현해요." className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400 disabled:cursor-not-allowed">로그인</button>
        </div>
      </div>
    </header>
  );
}
