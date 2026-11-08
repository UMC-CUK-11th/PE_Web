import { createRootRoute, Outlet, Link } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen min-w-80 flex-col bg-[#f6f7f9] font-[Arial,'Apple_SD_Gothic_Neo',sans-serif] text-[#171b25] [&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4">
      <Header />
      <Outlet />
      <footer className="mt-auto border-t border-[#e9eaf0] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-5 py-5 text-[10px] text-[#6a7081] sm:px-10">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-13" />
          <p>
            This product uses the TMDB API but is not endorsed or certified by
            TMDB.
          </p>
        </div>
      </footer>
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <h1 className="mb-4 text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link to="/" className="text-blue-600 underline">
        영화 목록으로
      </Link>
    </main>
  ),
});
