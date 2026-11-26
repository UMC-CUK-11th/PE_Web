"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "../../components/auth/auth-card";
import { inputStyle, primaryButtonStyle } from "../../components/auth/form-styles";
import { validEmail } from "./signup-validation";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { memberErrorMessage } from "../../api/api-client";
import { useAuthStore } from "../../stores/auth-store";
export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const lock = useRef(false);
  const mutation = useLoginMutation(() => { lock.current = false; });
  const notice = useAuthStore((state) => state.notice);
  const router = useRouter();
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.accessToken);
  useEffect(() => { if (hydrated && token) router.replace("/"); }, [hydrated, token, router]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validEmail(email) || !password || lock.current || mutation.isPending) return;
    lock.current = true;
    mutation.mutate({ email: email.trim(), password });
  }
  if (!hydrated || token) return <main className="p-12 text-center" role="status">로그인 상태를 확인 중이에요.</main>;
  return <AuthCard title="로그인" description="다시 만나 반가워요. 나만의 영화 이야기를 이어가요.">
    <form className="mt-8 space-y-6" onSubmit={submit} noValidate>
      <div><label htmlFor="login-email" className="mb-2 block text-sm font-semibold">이메일</label><input id="login-email" className={inputStyle} type="email" autoComplete="email" value={email} disabled={mutation.isPending} placeholder="you@example.com" onChange={(event) => { setEmail(event.target.value); mutation.reset(); }} /></div>
      <div><label htmlFor="login-password" className="mb-2 block text-sm font-semibold">비밀번호</label><input id="login-password" className={inputStyle} type="password" autoComplete="current-password" value={password} disabled={mutation.isPending} placeholder="비밀번호를 입력해 주세요" onChange={(event) => { setPassword(event.target.value); mutation.reset(); }} /></div>
      {(mutation.isError || notice) && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{mutation.isError ? memberErrorMessage(mutation.error) : notice}</p>}
      <button type="submit" className={primaryButtonStyle} disabled={!validEmail(email) || !password || mutation.isPending}>{mutation.isPending ? "로그인 중…" : "로그인"}</button>
    </form>
    <p className="mt-7 text-center text-sm text-slate-500">아직 계정이 없나요? <Link href="/signup" className="ml-1 font-bold text-blue-700">회원가입</Link></p>
  </AuthCard>;
}
