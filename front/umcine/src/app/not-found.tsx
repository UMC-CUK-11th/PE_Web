import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-content-center gap-4 text-center">
      <h1>페이지를 찾을 수 없어요.</h1>
      <Link href="/" className="text-sm text-[#2865e7]">영화 목록으로 돌아가기</Link>
    </main>
  );
}
