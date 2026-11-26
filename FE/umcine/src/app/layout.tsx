import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import Header from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: { default: "UMCine — 나의 영화 취향", template: "%s | UMCine" },
  description:
    "영화를 검색하고, 좋아하는 영화를 저장하고, 나만의 평점을 남기는 UMCine.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
          <footer className="border-t border-zinc-200 bg-white px-5 py-6 text-center text-xs text-zinc-500">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/images/logos/tmdb-logo.svg"
                alt="TMDB"
                width={80}
                height={32}
                className="h-auto w-20"
              />
              영화 정보 제공: TMDB
            </a>
            <p className="mt-2">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
