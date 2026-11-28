"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthPanel from "../../components/auth/auth-panel";
import {
  buttonClassName,
  inputClassName,
  linkClassName,
} from "../../components/auth/form-styles";

import { useLoginMutation } from "../../hooks/use-login-mutation";
import { EMAIL_REGEX } from "../../utils/auth/validation";
import { getRequestErrorMessage } from "../../utils/auth/request-error";

export function LoginPage({ registered }: { registered: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit =
    EMAIL_REGEX.test(email.trim()) &&
    password.length > 0 &&
    !loginMutation.isPending &&
    !loginMutation.isSuccess;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <AuthPanel
      title="로그인"
      description="다시 만나 반가워요. 오늘은 어떤 영화를 만나볼까요?"
    >
      {registered && (
        <p role="status" className="mb-4 text-sm text-emerald-700">
          회원가입을 완료했어요. 가입한 계정으로 로그인해 주세요.
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        aria-busy={loginMutation.isPending}
      >
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold">
            이메일
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            disabled={loginMutation.isPending}
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              loginMutation.reset();
            }}
            className={inputClassName}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-bold"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            disabled={loginMutation.isPending}
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              loginMutation.reset();
            }}
            className={inputClassName}
          />
        </div>
        <button disabled={!canSubmit} className={`${buttonClassName} w-full`}>
          {loginMutation.isPending ? "로그인 중" : "로그인"}
        </button>
        {loginMutation.isError && (
          <p role="alert" className="text-sm text-red-700">
            {getRequestErrorMessage(
              loginMutation.error,
              "로그인하지 못했어요.",
            )}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        처음 오셨나요?{" "}
        <Link href="/signup" className={linkClassName}>
          회원가입
        </Link>
      </p>
    </AuthPanel>
  );
}
