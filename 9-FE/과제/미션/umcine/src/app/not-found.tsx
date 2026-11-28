import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-12">
      <h1 className="mb-4 text-2xl font-bold">페이지를 찾을 수 없어요.</h1>
      <Link href="/" className="text-blue-600 underline">
        영화 목록으로
      </Link>
    </main>
  );
}
