import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "TMDB 인기 영화를 보고 평점과 즐겨찾기를 남기는 UMCine",
};

// 레이아웃은 Server Component로 두고, 상태가 필요한 Header와 Providers만 Client Component로 나눈다
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen min-w-80 flex-col bg-[#f6f7f9] font-[Arial,'Apple_SD_Gothic_Neo',sans-serif] text-[#171b25] [&_button]:cursor-pointer [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4">
        <Providers>
          <Header />
          {children}
          <footer className="mt-auto border-t border-[#e9eaf0] bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-end gap-3 px-5 py-5 text-[10px] text-[#6a7081] sm:px-10">
              <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-13" />
              <p>
                This product uses the TMDB API but is not endorsed or certified by
                TMDB.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
