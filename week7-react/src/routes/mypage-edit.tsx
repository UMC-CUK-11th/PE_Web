import { createFileRoute } from "@tanstack/react-router";
import { MyPageEdit } from "../pages/mypage/mypage-edit-page.tsx";

export const Route = createFileRoute("/mypage-edit")({
  component: MyPageEdit,
});
