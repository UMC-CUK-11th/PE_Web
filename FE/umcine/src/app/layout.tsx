import type { Metadata } from "next";
import { Suspense } from "react";
import { GeistSans } from "geist/font/sans";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "영화를 찾고 즐겨찾기와 나만의 평점을 기록해요.",
  openGraph: { title: "UMCine", description: "영화를 찾고 즐겨찾기와 나만의 평점을 기록해요.", type: "website" },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="ko"><body className={GeistSans.className + " min-h-screen bg-[#f7f8fb] text-[#17181c] antialiased"}>
    <Providers>
      <Suspense fallback={<div className="h-14 border-b border-slate-200 bg-white" aria-hidden="true" />}>
        <Header />
      </Suspense>
      {children}
      <Footer />
    </Providers>
  </body></html>;
}
