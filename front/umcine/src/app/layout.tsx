import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";
import { AppProviders } from "@/components/layout/app-providers";
import { Header } from "@/components/layout/header";
import "../index.css";

const description = "영화를 검색하고 즐겨찾기와 나만의 평점을 기록하세요.";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description,
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "UMCine", description, type: "website", locale: "ko_KR" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={GeistSans.variable}>
      <body>
        <AppProviders>
          <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col border-x border-[#e7e9ed] bg-[#f6f7f9] text-[#1b1f27]">
            <Header />
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
