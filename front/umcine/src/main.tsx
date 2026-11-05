import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { routeTree } from "./routeTree.gen";
import "./index.css";

const router = createRouter({ routeTree });
const ONE_MINUTE = 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: ONE_MINUTE } },
});

const memberApiCheckParams = new URLSearchParams(window.location.search);
if (import.meta.env.DEV && memberApiCheckParams.get("check-member-api") === "1") {
  void import("./examples/check-member-api").then(({ checkMemberApi }) => {
    checkMemberApi(memberApiCheckParams);
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
