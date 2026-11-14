import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../../pages/profile-pages";
export const Route = createFileRoute("/(auth)/_auth/my/")({ component: ProfilePage });
