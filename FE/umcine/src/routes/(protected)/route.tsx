import { createFileRoute, redirect } from "@tanstack/react-router";

import { ProtectedLayout } from "../../components/layout/protected-layout";
import { useAuthStore } from "../../stores/auth-store";

// (protected)는 Route Group이에요. 괄호 폴더는 주소에 들어가지 않아서 /my, /my/edit 주소는 그대로예요.
// 이 폴더의 route.tsx가 공통 Layout Route가 되어, 안의 페이지들은 모두 로그인 검사를 거친 뒤 <Outlet />에 그려져요.
export const Route = createFileRoute("/(protected)")({
  // 주소로 직접 들어와도 페이지를 그리기 전에 막아요.
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});
