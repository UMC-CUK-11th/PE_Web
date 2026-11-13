import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  return <main className="mx-auto max-w-lg px-6 py-14">
    <h1 className="mb-8 text-3xl font-bold">로그인</h1>
    <form className="space-y-6" onSubmit={event => { event.preventDefault(); setMessage("로그인 기능은 준비 중이에요."); }}>
      <div><label htmlFor="login-email" className="mb-2 block">이메일</label>
        <input id="login-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3" /></div>
      <div><label htmlFor="login-password" className="mb-2 block">비밀번호</label>
        <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3" /></div>
      <button className="w-full rounded-lg bg-red-600 py-3 font-bold">로그인</button>
      <p role="status">{message}</p>
    </form>
    <p className="mt-6 text-center text-gray-400">계정이 없나요? <Link to="/signup" className="text-white underline">회원가입</Link></p>
  </main>;
}
