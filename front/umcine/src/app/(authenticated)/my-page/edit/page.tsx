import type { Metadata } from "next";
import { EditMyProfilePage } from "@/features/members/edit-my-profile-page";

export const metadata: Metadata = { title: "내 정보 수정" };

export default function Page() {
  return <EditMyProfilePage />;
}
