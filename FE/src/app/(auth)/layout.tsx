import type { ReactNode } from "react";
import { AuthLayout } from "../../components/layout/auth-layout";

// (auth): Route Group. 로그인 전용 페이지를 한 폴더에 묶지만 URL에는 안 나타남
// 토큰이 localStorage에 있어서 서버는 로그인 여부를 모름 → 검사는 Client Component(AuthLayout)에서 함
export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
