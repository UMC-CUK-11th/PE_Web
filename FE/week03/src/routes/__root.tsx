import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#f7f8fb] font-sans text-[#17181c] antialiased">
      <Header />
      <Outlet />
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <main className="grid min-h-[calc(100vh-160px)] place-content-center px-5 text-center">
      <p className="text-lg font-bold">페이지를 찾을 수 없어요.</p>
    </main>
  ),
});
