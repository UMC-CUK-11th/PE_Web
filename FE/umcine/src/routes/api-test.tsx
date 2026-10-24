import { createFileRoute } from "@tanstack/react-router";
import { ApiTestPage } from "../pages/api-test-page";

export const Route = createFileRoute("/api-test")({ component: ApiTestPage });
