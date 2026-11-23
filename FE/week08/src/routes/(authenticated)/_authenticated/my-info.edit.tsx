import { createFileRoute } from "@tanstack/react-router";
import { EditMyInfoPage } from "../../../pages/auth-required/edit-my-info-page";

export const Route = createFileRoute("/(authenticated)/_authenticated/my-info/edit")({ component: EditMyInfoPage });
