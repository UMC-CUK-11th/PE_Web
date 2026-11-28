import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootLayout } from "../components/layout/root-layout";
import Providers from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "UMCine",
  icons: { icon: "/favicon.svg" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div id="root">
          <Providers><RootLayout>{children}</RootLayout></Providers>
        </div>
      </body>
    </html>
  );
}
