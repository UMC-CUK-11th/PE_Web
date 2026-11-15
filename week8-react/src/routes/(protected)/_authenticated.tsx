import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(protected)/_authenticated")({
  beforeLoad: ({ location }) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },

  component: () => <Outlet />,
});
