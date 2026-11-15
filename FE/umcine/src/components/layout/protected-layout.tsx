import { Navigate, Outlet } from "@tanstack/react-router";

import { useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지들의 공통 Layout이에요. 안의 페이지는 <Outlet /> 자리에 그려져요.
export function ProtectedLayout() {
  // 페이지에 있는 동안 로그아웃하거나 토큰이 만료(401)돼도 바로 로그인 화면으로 보내요.
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
