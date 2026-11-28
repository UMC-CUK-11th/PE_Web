import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "새 페이지",
  description: "빌드에서 정적으로 생성되는 Next.js 예제입니다.",
  openGraph: { title: "Next.js 연습장", description: "App Router 정적 페이지 예제", images: ["/sample.jpg"] },
};
export default function NewPage() {
  return <><h1>새 페이지</h1><p>빌드 시 미리 생성하는 정적 페이지입니다.</p></>;
}
