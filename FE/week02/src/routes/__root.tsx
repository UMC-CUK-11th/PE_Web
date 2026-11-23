/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/header";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#202124]" id="top">
      <Header />
      <Outlet />
      <footer className="mt-auto h-14 shrink-0 border-t border-[#e1e4e8] bg-white">
        <div className="mx-auto flex h-full w-[min(calc(100%-48px),1200px)] items-center justify-end gap-1 text-[10px] text-[#7f8792] max-[420px]:w-[calc(100%-32px)]">
          <img className="mr-0.5 w-[23px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          <span>This product uses the TMDB API but is not endorsed or certified by</span>
          <a className="underline" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB.</a>
        </div>
      </footer>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="grid flex-1 place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-bold text-[#2877eb]">404</p>
        <h1 className="mt-3 text-[32px] font-extrabold">페이지를 찾을 수 없어요.</h1>
        <a className="mt-8 inline-flex rounded-lg bg-[#2877eb] px-5 py-3 text-sm font-bold text-white no-underline" href="/">영화 목록으로</a>
      </div>
    </main>
  );
}
