import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col border-x border-[#e7e9ed] bg-[#f6f7f9] text-[#1b1f27]">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
