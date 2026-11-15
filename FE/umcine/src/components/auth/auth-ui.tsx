import type { InputHTMLAttributes, ReactNode } from "react";

export function AuthCard({ title, description, children }: {
  title: string; description: string; children: ReactNode;
}) {
  return (
    <main className="flex min-h-[80vh] w-full justify-center bg-[#f6f7f9] px-6 py-16 sm:py-28">
      <section className="h-fit w-full max-w-[460px]">
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
        </div>
        {children}
      </section>
    </main>
  );
}

export function AuthField({ label, error, hint, action, ...input }: InputHTMLAttributes<HTMLInputElement> & {
  id: string; label: string; error?: string; hint?: string; action?: ReactNode;
}) {
  const description = error || hint;
  return (
    <div>
      <label htmlFor={input.id} className="mb-2 block text-sm font-semibold text-gray-800">{label}</label>
      <div className={`flex overflow-hidden rounded-lg border bg-white focus-within:border-[#536be8] focus-within:ring-2 focus-within:ring-[#536be8]/15 ${error ? "border-red-500" : "border-gray-300"}`}>
        <input {...input} aria-invalid={Boolean(error)} aria-describedby={description ? `${input.id}-help` : undefined}
          className="min-w-0 flex-1 px-3 py-3 text-sm outline-none disabled:bg-gray-100" />
        {action}
      </div>
      {description && <p id={`${input.id}-help`} className={`mt-2 text-xs leading-5 ${error ? "text-red-600" : "text-gray-500"}`}>{description}</p>}
    </div>
  );
}
