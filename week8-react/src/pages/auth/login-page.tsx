import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  // 로그인 API 요청
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  return (
    <main className="min-h-[calc(100vh-86px)] bg-[#f5f6f8] px-5">
      <div className="mx-auto w-full max-w-[440px] pt-[135px]">
        <h1 className="mb-9 text-[30px] font-bold text-[#191919]">로그인</h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* 이메일 */}
          <label
            htmlFor="login-email"
            className="mb-3 text-[13px] font-semibold text-[#252525]"
          >
            이메일
          </label>

          <div className="mb-6 flex h-[52px] items-center gap-3 rounded-md border border-[#dfe3e8] bg-white px-4 focus-within:border-blue-500">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>

            <input
              id="login-email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-[14px] text-[#252525] outline-none placeholder:text-gray-400"
              required
            />
          </div>

          {/* 비밀번호 */}
          <label
            htmlFor="login-password"
            className="mb-3 text-[13px] font-semibold text-[#252525]"
          >
            비밀번호
          </label>

          <div className="mb-4 flex h-[52px] items-center gap-3 rounded-md border border-[#dfe3e8] bg-white px-4 focus-within:border-blue-500">
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <circle cx="12" cy="15" r="1" />
            </svg>

            <input
              id="login-password"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-[14px] text-[#252525] outline-none placeholder:text-gray-400"
              required
            />
          </div>

          {/* 로그인 오류 */}
          {loginMutation.isError && (
            <p className="mb-4 text-[12px] text-red-500">
              이메일 또는 비밀번호를 확인해 주세요.
            </p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="h-[50px] w-full cursor-pointer rounded-md bg-[#3050d5] text-[14px] font-semibold text-white hover:bg-[#2442bf] disabled:cursor-not-allowed disabled:bg-[#9aa9e8]"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>

          <p className="mt-5 text-center text-[12px] text-[#9299a8]">
            처음이신가요?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#3050d5] underline underline-offset-2"
            >
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
