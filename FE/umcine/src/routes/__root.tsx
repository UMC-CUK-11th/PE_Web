import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header.tsx";
import { Footer } from "../components/layout/footer.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
