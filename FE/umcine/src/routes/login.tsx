import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page";
import { useAuthStore } from "../stores/auth-store";

export const Route = createFileRoute("/login")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { registered?: boolean } =>
    search.registered === true ? { registered: true } : {},
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) throw redirect({ to: "/" });
  },
  component: LoginPage,
});
