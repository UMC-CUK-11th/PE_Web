import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

// root route는 모든 페이지가 공통으로 사용하는 바깥 구조이다.
export const Route = createRootRoute({
  component: () => (
    <>
      {/* Header는 URL이 바뀌어도 공통으로 유지된다. */}
      <Header />

      {/* 현재 URL과 일치하는 자식 route의 화면이 이 자리에 표시된다. */}
      <Outlet />
    </>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
