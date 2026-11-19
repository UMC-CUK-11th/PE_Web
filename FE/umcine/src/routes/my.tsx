import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/my")({ beforeLoad: () => { throw redirect({ to: "/mypage" }); } });
