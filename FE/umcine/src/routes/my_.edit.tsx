import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../pages/my/my-edit-page";

// The trailing underscore keeps /my/edit independent of the /my page component.
export const Route = createFileRoute("/my_/edit")({ component: MyEditPage });
