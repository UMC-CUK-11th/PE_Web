import { getRouteApi, Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { FormField, primaryButtonClass } from "../../components/form/form-field";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getApiErrorMessage } from "../../utils/get-api-error-message";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const route = getRouteApi("/login");

export function LoginPage() {
  const { signedUp } = route.useSearch();
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  function handleChange(key: keyof typeof form, value: string) {
    // 입력을 고치면 지난 실패 안내를 지운다
    if (loginMutation.isError) loginMutation.reset();
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: form.email.trim(), password: form.password });
  }

  return (
    <main className="flex w-full flex-1 justify-center px-5 py-20">
      <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[440px] flex-col gap-5">
        <h1 className="text-[32px] font-bold">로그인</h1>
        {signedUp && (
          <p role="status" className="rounded-md bg-[#e8eefc] px-4 py-3 text-sm text-[#235ce8]">
            회원가입이 완료됐어요. 가입한 이메일로 로그인해 주세요.
          </p>
        )}
        <FormField
          id="login-email"
          label="이메일"
          type="email"
          icon="/icons/mail.svg"
          placeholder="name@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(event) => handleChange("email", event.target.value)}
        />
        <FormField
          id="login-password"
          label="비밀번호"
          type="password"
          icon="/icons/lock.svg"
          placeholder="비밀번호"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => handleChange("password", event.target.value)}
        />
        <button type="submit" disabled={!canSubmit || loginMutation.isPending} className={primaryButtonClass}>
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
        {loginMutation.isError && (
          <p role="alert" className="text-center text-sm text-red-600">
            {getApiErrorMessage(loginMutation.error, "로그인에 실패했어요. 다시 시도해 주세요.")}
          </p>
        )}
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
