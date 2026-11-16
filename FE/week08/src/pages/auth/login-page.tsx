import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-[440px]">
        <h1 className="mb-2 text-[32px] font-bold">로그인</h1>
        <p className="mb-8 text-sm text-[#7b808b]">UMCine에 오신 것을 환영해요.</p>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="login-email">이메일</label>
            <input
              className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none focus:border-[#3678ff]"
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="이메일을 입력해 주세요"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="login-password">비밀번호</label>
            <input
              className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none focus:border-[#3678ff]"
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          <button
            className="h-12 w-full rounded-lg bg-[#2669ee] text-sm font-bold text-white disabled:bg-[#9bb5f2]"
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#a4aab5]">
          아직 계정이 없나요? <Link className="font-bold text-[#2669ee]" to="/signup">회원가입</Link>
        </p>
      </div>
    </main>
  );
}
