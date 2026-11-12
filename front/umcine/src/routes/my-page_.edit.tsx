import { createFileRoute } from "@tanstack/react-router";
import { EditMyProfilePage } from "../pages/members/edit-my-profile-page";

export const Route = createFileRoute("/my-page_/edit")({ component: EditMyProfilePage });
