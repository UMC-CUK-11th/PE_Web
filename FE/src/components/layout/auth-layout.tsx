import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지들의 공통 레이아웃: 하위 페이지를 <Outlet />으로 그림
export function AuthLayout() {
  // 페이지를 보는 중에 401로 토큰이 지워지면 로그인 화면으로 보냄
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) return <Navigate to="/login" />;
  return <Outlet />;
}
