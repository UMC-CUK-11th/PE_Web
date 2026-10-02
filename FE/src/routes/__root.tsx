import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#141517] font-sans text-white">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => <main className="mx-auto max-w-[1200px] px-5 py-20 text-center">페이지를 찾을 수 없어요.</main>,
});
