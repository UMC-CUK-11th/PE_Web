import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField, primaryButtonClass } from "../../components/form/form-field";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const canSubmit = form.email.trim().length > 0 && form.password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // 로그인 API 연결은 8주차에 한다
  }

  return (
    <main className="flex w-full flex-1 justify-center px-5 py-20">
      <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[440px] flex-col gap-5">
        <h1 className="text-[32px] font-bold">로그인</h1>
        <FormField
          id="login-email"
          label="이메일"
          type="email"
          icon="/icons/mail.svg"
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          icon="/icons/lock.svg"
          placeholder="비밀번호"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        <button type="submit" disabled={!canSubmit} className={primaryButtonClass}>
          로그인
        </button>
        <p className="text-center text-[13px] text-[#6a7081]">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-[#235ce8]">
            회원가입
          </Link>
        </p>
      </form>
    </main>
  );
}
