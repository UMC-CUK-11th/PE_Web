import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <footer aria-label="출처" className="mx-auto max-w-6xl border-t border-gray-200 px-6 py-6 text-sm text-gray-500">
        <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="inline-block">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="mb-3 w-24" />
        </a>
        <p>영화 데이터 및 이미지 제공: TMDB</p>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
