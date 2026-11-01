import { createFileRoute } from "@tanstack/react-router";
import { BackendCheckPage } from "../pages/backend-check-page";

export const Route = createFileRoute("/backend-check")({
  component: BackendCheckPage,
});
