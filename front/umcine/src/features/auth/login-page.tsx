"use client";

import Image from "next/image";
import Link from "next/link";
import { isHTTPError } from "ky";
import { useEffect, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useStorageReady } from "@/components/layout/app-providers";
import { useAuthStore } from "@/stores/auth-store";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelClassName = "mb-1.5 block text-sm font-semibold";
const inputClassName =
  "h-12 w-full rounded-md border border-[#e0e4ea] bg-white pr-3.5 pl-9 text-sm placeholder:text-[#858e9d] focus-visible:border-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563eb]";
const inputIconClassName =
  "pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 opacity-55";

export function LoginPage() {
  const router = useRouter();
  const storageReady = useStorageReady();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;
  const errorMessage = isHTTPError(loginMutation.error) && loginMutation.error.response.status === 401
    ? "이메일 또는 비밀번호가 올바르지 않습니다."
    : "로그인 요청에 실패했어요. 다시 시도해 주세요.";

  useEffect(() => {
    if (storageReady && accessToken) router.replace("/");
  }, [accessToken, router, storageReady]);

  if (!storageReady || accessToken) {
    return <p role="status" className="py-12 text-center text-sm text-[#747b86]">로그인 상태를 확인하고 있어요.</p>;
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section className="w-full max-w-[428px]" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-5 text-[32px] leading-tight font-extrabold tracking-tight">
          로그인
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={labelClassName} htmlFor="login-email">이메일</label>
            <div className="relative">
              <Image width={16} height={16} className={inputIconClassName} src="/icons/mail.svg" alt="" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                className={inputClassName}
                placeholder="name@example.com"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClassName} htmlFor="login-password">비밀번호</label>
            <div className="relative">
              <Image width={16} height={16} className={inputIconClassName} src="/icons/lock.svg" alt="" />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={inputClassName}
                placeholder="비밀번호"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-[46px] w-full cursor-pointer rounded-md bg-[#2563eb] text-sm font-bold text-white enabled:hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
          {loginMutation.isError && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
        </form>

        <p className="mt-5 text-center text-xs text-[#667080]">
          처음이신가요?{" "}
          <Link href="/signup" className="font-bold text-[#2563eb] hover:underline">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
