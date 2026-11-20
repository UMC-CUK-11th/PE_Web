import { createFileRoute } from "@tanstack/react-router";
import { MemberProfileEditPage } from "../../../../pages/member/member-profile-edit-page";

export const Route = createFileRoute("/(authenticated)/_authenticated/my/edit")({
  component: MemberProfileEditPage,
});
