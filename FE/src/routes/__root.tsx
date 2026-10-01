import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <p className="mt-3 text-slate-600">위의 영화 또는 검색 메뉴로 이동해 주세요.</p>
    </main>
  ),
});
