import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: "umcine",
  icons: { icon: "/favicon.svg" },
};

// Server Component: 모든 페이지에 공통으로 들어가는 틀 (헤더, 푸터, TMDB 출처)
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
          <footer aria-label="출처" className="mx-auto max-w-6xl border-t border-gray-200 px-6 py-6 text-sm text-gray-500">
            <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="inline-block">
              <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="mb-3 w-24" />
            </a>
            <p>영화 데이터 및 이미지 제공: TMDB</p>
            <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
