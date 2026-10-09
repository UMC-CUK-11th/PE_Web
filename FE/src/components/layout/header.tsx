import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-xl font-bold text-black no-underline"
          >
            UMCine
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              className="text-black no-underline"
            >
              영화
            </Link>

            <Link
              to="/search"
              className="text-black no-underline"
            >
              검색
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-black no-underline"
          >
            🔍
          </Link>

          <button
            type="button"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}