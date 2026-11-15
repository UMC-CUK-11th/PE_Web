import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../pages/auth/login-page.tsx";

export const Route = createFileRoute("/login")({
  validateSearch: (search): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});
