import { Link, Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function AuthLayout() {
  const token = useAuthStore(state => state.accessToken);
  if (!token) return <Navigate to="/login" />;
  return <>
    <nav className="mx-auto flex max-w-[1200px] gap-6 px-5 pt-6" aria-label="회원 메뉴">
      <Link to="/my">마이페이지</Link><Link to="/me">내 정보</Link><Link to="/edit-profile">내 정보 수정</Link>
    </nav>
    <Outlet />
  </>;
}
