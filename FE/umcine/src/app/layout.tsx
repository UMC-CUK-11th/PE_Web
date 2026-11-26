
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";

import Header from "../components/layout/header";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: {
    default: "UMCine — 나의 영화 취향",
    template: "%s | UMCine",
  },
  description:
    "영화를 검색하고, 좋아하는 영화를 저장하고, 나만의 평점을 남기는 UMCine.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="cinema-theme flex min-h-screen flex-col antialiased">
        <Providers>
          <Header />

          <div className="flex-1">{children}</div>

          <footer className="border-t border-[#26344c] bg-[#111827] px-5 py-10 text-center">
            <p className="mb-3 text-xl font-black tracking-tight text-white">
              UMC<span className="text-blue-400">ine</span>
            </p>

            <p className="mb-6 text-xs text-slate-400">
              영화로 채워가는 나만의 취향
            </p>

            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 text-xs text-slate-400"
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

            <p className="mt-3 text-xs leading-5 text-slate-400">
              This product uses the TMDB API but is not endorsed
              or certified by TMDB.
            </p>
          </footer>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
