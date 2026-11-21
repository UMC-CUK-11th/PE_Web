import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../../../pages/profile-pages";
export const Route = createFileRoute("/(auth)/_auth/my/edit")({ component: ProfileEditPage });
