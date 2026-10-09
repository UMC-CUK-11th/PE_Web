// 이 파일은 React 앱의 시작점이다. index.html의 #root에 화면을 붙이기 위해 필요하다.
// 생성된 라우트 목록과 전역 CSS를 가져와 모든 페이지에서 사용할 라우터를 준비한다.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });

// Link, useParams 등이 이 라우터의 경로와 파라미터를 타입으로 확인하도록 등록한다.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// StrictMode는 개발 중 잠재적인 문제를 찾아준다. RouterProvider가 현재 URL의 페이지를 그린다.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
