import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";
import { AuthenticatedLayout } from "../../components/auth/authenticated-layout";
export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: () => { if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" }); },
  component: AuthenticatedLayout,
});
