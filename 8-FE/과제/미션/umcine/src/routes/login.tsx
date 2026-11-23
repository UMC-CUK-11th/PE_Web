import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/login")({
  validateSearch: (search): { signedUp?: boolean } => ({
    signedUp: search.signedUp === true ? true : undefined,
  }),
  // 이미 토큰이 있으면 로그인 화면 대신 홈으로 보낸다. 토큰이 유효한지는 내 정보 API가 확인한다
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});
