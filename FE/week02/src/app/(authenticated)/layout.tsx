import type { ReactNode } from "react";
import { AuthGuard } from "./auth-guard";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
