import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { apiErrorMessage } from "../../utils/api-error-message";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mutation = useLoginMutation();
  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length > 0;
  return <main className="mx-auto max-w-lg px-6 py-14">
    <h1 className="mb-8 text-3xl font-bold">로그인</h1>
    <form className="space-y-6" onSubmit={event => {
      event.preventDefault();
      if (canSubmit && !mutation.isPending) mutation.mutate({ email: email.trim(), password });
    }}>
      <div><label htmlFor="login-email" className="mb-2 block">이메일</label>
        <input id="login-email" type="email" autoComplete="email" required value={email} disabled={mutation.isPending}
          onChange={event => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3" /></div>
      <div><label htmlFor="login-password" className="mb-2 block">비밀번호</label>
        <input id="login-password" type="password" autoComplete="current-password" required value={password} disabled={mutation.isPending}
          onChange={event => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3" /></div>
      <button disabled={!canSubmit || mutation.isPending} className="w-full rounded-lg bg-red-600 py-3 font-bold disabled:opacity-40">
        {mutation.isPending ? "로그인 중" : "로그인"}</button>
      {mutation.isError && <p role="alert" className="text-red-400">{apiErrorMessage(mutation.error)}</p>}
    </form>
    <p className="mt-6 text-center text-gray-400">계정이 없나요? <Link to="/signup" className="text-white underline">회원가입</Link></p>
  </main>;
}
