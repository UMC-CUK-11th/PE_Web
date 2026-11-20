import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "../../components/auth/auth-layout";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" });
  },
  component: AuthLayout,
});
