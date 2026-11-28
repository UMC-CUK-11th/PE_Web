import type { Metadata } from "next";
import { ProfilePage } from "../../../screens/mypage/profile-page";

export const metadata: Metadata = { title: "내 정보" };
export default function Page() { return <ProfilePage />; }
