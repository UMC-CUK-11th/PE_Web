function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* 왼쪽 */}
        <div className="flex items-center gap-10">
          {/* 로고 */}
          <div className="flex items-center gap-2">
            <img
              src="/icons/movie-icons/movie.svg"
              alt=""
              className="h-7 w-7"
            />
            <span className="text-xl font-bold text-gray-900">
              UMCine
            </span>
          </div>

          {/* 메뉴 */}
          <nav className="flex items-center gap-7 text-sm font-medium">
            <span className="cursor-pointer font-semibold text-gray-900">
              영화
            </span>

            <span className="cursor-pointer text-gray-500 transition hover:text-gray-900">
              검색
            </span>

            <span className="cursor-pointer text-gray-500 transition hover:text-gray-900">
              내 정보
            </span>
          </nav>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt="검색"
              className="h-5 w-5"
            />
          </button>

          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;