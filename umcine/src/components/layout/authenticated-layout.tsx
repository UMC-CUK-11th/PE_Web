import { Link, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export function AuthenticatedLayout() {
  const token = useAuthStore((state) => state.accessToken);
  return token ? <Outlet /> : <main className="profile-page"><Link to="/login">로그인이 필요해요.</Link></main>;
}
