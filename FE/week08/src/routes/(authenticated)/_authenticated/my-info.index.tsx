import { createFileRoute } from "@tanstack/react-router";
import { MyInfoPage } from "../../../pages/auth-required/my-info-page";

export const Route = createFileRoute("/(authenticated)/_authenticated/my-info/")({ component: MyInfoPage });
