import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-3xl px-5 py-16 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link href="/" className="mt-6 inline-flex underline">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}
