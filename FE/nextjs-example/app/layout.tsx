import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: { default: "Next.js 연습장", template: "%s | Next.js 연습장" },
  description: "App Router로 페이지, 렌더링, 이미지 최적화를 실습합니다.",
};
export default function Layout({ children }: LayoutProps<"/">) {
  return <html lang="ko"><body><header><nav aria-label="실습 메뉴">
    <Link href="/">연습장</Link><Link href="/new">새 페이지</Link><Link href="/1">Todo 1</Link><Link href="/2">Todo 2</Link><Link href="/media">이미지 비교</Link>
  </nav></header><main>{children}</main><footer>Next.js App Router · 공통 레이아웃</footer></body></html>;
}
