import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "TMDB 영화 목록, 검색, 즐겨찾기와 평점을 제공하는 영화 서비스",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-[#202124]" id="top">
            <Header />
            {children}
            <footer className="mt-auto h-14 shrink-0 border-t border-[#e1e4e8] bg-white">
              <div className="mx-auto flex h-full w-[min(calc(100%-48px),1200px)] items-center justify-end gap-1 text-[10px] text-[#7f8792] max-[420px]:w-[calc(100%-32px)]">
                <img className="mr-0.5 w-[23px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
                <span>This product uses the TMDB API but is not endorsed or certified by</span>
                <a className="underline" href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB.</a>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
