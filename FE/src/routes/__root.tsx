// 이 파일은 모든 주소에 공통으로 적용되는 최상위 라우트다.
// 헤더·배경색을 한 번만 정의하고, Outlet 자리에 현재 페이지를 끼워 넣는다.
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#141517] font-sans text-white">
      <Header />
      {/* 현재 URL에 맞는 하위 페이지가 이 위치에 표시된다. */}
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-[1200px] px-5 py-20 text-center">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
