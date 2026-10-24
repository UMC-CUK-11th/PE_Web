import { createRootRoute, Outlet } from "@tanstack/react-router";
import Header from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer className="border-t border-zinc-200 bg-white px-5 py-6 text-center text-xs text-zinc-500">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3"
        >
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-20" />
          영화 정보 제공: TMDB
        </a>
        <p className="mt-2">
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </footer>
    </>
  ),

  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
