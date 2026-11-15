import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "../../components/layout/auth-layout";
import { useAuthStore } from "../../stores/auth-store";

// (auth): Route Group. 로그인 전용 페이지를 한 폴더에 묶지만 URL에는 안 나타남
// _auth: Layout Route. URL에는 안 나타나고, 하위 페이지에 들어가기 전에 토큰을 검사함
export const Route = createFileRoute("/(auth)/_auth")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});
