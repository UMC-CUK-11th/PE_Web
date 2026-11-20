import { createFileRoute } from "@tanstack/react-router";
import { MemberProfilePage } from "../../../../pages/member/member-profile-page";

export const Route = createFileRoute("/(authenticated)/_authenticated/my/")({
  component: MemberProfilePage,
});
