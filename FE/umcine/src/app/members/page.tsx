import type { Metadata } from "next";
import { MembersPage } from "../../screens/members/members-page";

export const metadata: Metadata = { title: "회원과 평점" };
export default function Page() { return <MembersPage />; }
