import type { ReactNode } from "react";
import { ProtectedGate } from "../../components/auth/protected-gate";

// (protected) 폴더는 주소에 나타나지 않고, 안의 페이지를 이 레이아웃이 감싼다
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedGate>{children}</ProtectedGate>;
}
