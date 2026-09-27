import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2"
          aria-label="UMCine 홈"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-lg font-black text-white shadow-sm transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
            U
          </div>

          <div className="flex items-baseline">
            <span className="text-[24px] font-black tracking-[-0.06em] text-zinc-950">
              UMC
            </span>
            <span className="text-[24px] font-black tracking-[-0.06em] text-zinc-500">
              ine
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 rounded-2xl bg-zinc-100 p-1.5">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{
              className:
                "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-sm",
            }}
            inactiveProps={{
              className:
                "rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/70 hover:text-zinc-900",
            }}
          >
            영화
          </Link>

          <Link
            to="/search"
            activeProps={{
              className:
                "rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 shadow-sm",
            }}
            inactiveProps={{
              className:
                "rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/70 hover:text-zinc-900",
            }}
          >
            검색
          </Link>

          <button
            type="button"
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-white/70 hover:text-zinc-900"
          >
            북마크
          </button>
        </nav>
      </div>
    </header>
  );
}