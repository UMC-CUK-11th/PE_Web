import type { Metadata } from "next";
import { ApiTestPage } from "../../screens/api-test-page";

export const metadata: Metadata = { title: "Backend API 확인" };

export default function Page() {
  return <ApiTestPage />;
}
