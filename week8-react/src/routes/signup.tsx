import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "../pages/auth/signup-page.tsx";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
