import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthCard({ title, description, children }: {
  title: string; description: string; children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-112px)] max-w-5xl items-center px-4 py-10 md:px-8 md:py-14">
      <div className="grid w-full overflow-hidden rounded-3xl border border-[#e7e8ec] bg-white shadow-sm lg:grid-cols-[0.8fr_1fr]">
        <aside className="hidden flex-col justify-between bg-[#eef3ff] p-10 lg:flex">
          <Link to="/" className="text-sm font-extrabold tracking-wide text-blue-700">UMCine</Link>
          <div className="py-16">
            <span className="mb-7 grid size-16 place-items-center rounded-2xl bg-white shadow-sm" aria-hidden="true">
              <img className="size-8" src="/icons/movie-icons/movie-icons/movie.svg" alt="" />
            </span>
            <h2 className="text-3xl font-extrabold leading-snug tracking-tight text-[#172b55]">좋아하는 영화로<br />연결되는 우리.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">새로운 영화를 발견하고,<br />나만의 취향을 차곡차곡 모아 보세요.</p>
          </div>
          <p className="text-xs text-slate-500">당신의 다음 장면을 함께해요.</p>
        </aside>
        <section className="px-6 py-9 sm:px-10 sm:py-11">
          <p className="text-xs font-bold tracking-widest text-blue-600">WELCOME TO UMCINE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
