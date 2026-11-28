import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "../../views/auth/login-page";

export const metadata: Metadata = { title: "로그인" };

// LoginPage가 useSearchParams로 주소의 signedUp을 읽어서, 빌드할 때는 이 경계 밖만 미리 만든다
export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
