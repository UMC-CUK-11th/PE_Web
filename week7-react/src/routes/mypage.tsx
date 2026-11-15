import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../pages/mypage/mypage-page.tsx";

export const Route = createFileRoute("/mypage")({
  component: MyPage,
});
