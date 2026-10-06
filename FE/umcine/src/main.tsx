import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";

// 자동 생성된 routeTree를 이용해 실제 router를 만든다.
const router = createRouter({ routeTree });

// Link, params, search에서 현재 router의 route 타입을 사용할 수 있게 한다.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* React 앱에 TanStack Router를 연결한다. */}
    <RouterProvider router={router} />
  </StrictMode>,
);
