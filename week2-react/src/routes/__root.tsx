import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen min-w-80 bg-[#f6f7f9] font-[Pretendard,'Noto_Sans_KR',Inter,system-ui,sans-serif] text-[#17191f] antialiased">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
    <main className="mx-auto flex min-h-[calc(100vh-76px)] max-w-5xl items-center justify-center px-10 text-lg font-semibold">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
