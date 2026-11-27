import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid flex-1 place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-bold text-[#2877eb]">404</p>
        <h1 className="mt-3 text-[32px] font-extrabold">페이지를 찾을 수 없어요.</h1>
        <Link className="mt-8 inline-flex rounded-lg bg-[#2877eb] px-5 py-3 text-sm font-bold text-white no-underline" href="/">영화 목록으로</Link>
      </div>
    </main>
  );
}
