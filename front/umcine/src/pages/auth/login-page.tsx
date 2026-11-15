import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { login } from "../../api/auth/login";
import { myProfileQueryKey } from "../../api/members/get-my-profile";
import { useAuthStore } from "../../stores/auth-store";

const labelClassName = "mb-1.5 block text-sm font-semibold";
const inputClassName =
  "h-12 w-full rounded-md border border-[#e0e4ea] bg-white pr-3.5 pl-9 text-sm placeholder:text-[#858e9d] focus-visible:border-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563eb]";
const inputIconClassName =
  "pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 opacity-55";

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/login" });

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const { accessToken } = await login({ email, password });
      if (typeof accessToken !== "string" || !accessToken.trim()) {
        throw new Error("로그인 응답에 토큰이 없어요.");
      }

      queryClient.removeQueries({ queryKey: myProfileQueryKey, exact: true });
      setAccessToken(accessToken);
      await navigate({ to: "/my-page" });
    } catch (error) {
      setErrorMessage(
        isHTTPError(error) && error.response.status === 401
          ? "이메일 또는 비밀번호가 올바르지 않습니다."
          : "로그인 요청에 실패했어요. 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
              <img className={inputIconClassName} src="/icons/mail.svg" alt="" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                className={inputClassName}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClassName} htmlFor="login-password">비밀번호</label>
            <div className="relative">
              <img className={inputIconClassName} src="/icons/lock.svg" alt="" />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={inputClassName}
                placeholder="비밀번호"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-[46px] w-full cursor-pointer rounded-md bg-[#2563eb] text-sm font-bold text-white enabled:hover:bg-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "로그인 중" : "로그인"}
          </button>
          {errorMessage && <p role="alert" className="text-sm text-red-700">{errorMessage}</p>}
        </form>

        <p className="mt-5 text-center text-xs text-[#667080]">
          처음이신가요?{" "}
          <Link to="/signup" className="font-bold text-[#2563eb] hover:underline">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
