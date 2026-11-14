import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../pages/my/my-edit-page";

export const Route = createFileRoute(
  "/(authenticated)/_authenticated/my_/edit",
)({
  component: MyEditPage,
});
