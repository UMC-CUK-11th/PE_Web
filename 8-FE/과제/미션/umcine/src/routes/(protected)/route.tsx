import { createFileRoute, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// (protected) 폴더는 주소에 나타나지 않고, 안의 페이지를 이 레이아웃이 감싼다
export const Route = createFileRoute("/(protected)")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  // 보고 있는 중에 401로 토큰이 비워져도 로그인 화면으로 보낸다
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) return <Navigate to="/login" />;
  return <Outlet />;
}
