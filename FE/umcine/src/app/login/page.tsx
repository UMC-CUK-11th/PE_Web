import type { Metadata } from "next";
import { LoginPage } from "../../screens/auth/login-page";
import { GuestLayout } from "../../components/layout/guest-layout";

export const metadata: Metadata = { title: "로그인" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string | string[] }>;
}) {
  const { registered } = await searchParams;
  return (
    <GuestLayout>
      <LoginPage registered={registered === "true"} />
    </GuestLayout>
  );
}
