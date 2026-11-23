import type { ReactNode } from "react";

export default function AuthPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-[75vh] max-w-lg px-5 py-10 sm:py-16">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-9">
        <p className="text-xs font-bold tracking-widest text-zinc-500">
          UMCine
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}
