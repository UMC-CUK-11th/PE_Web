import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthCard } from "../../components/auth/auth-card";
import { inputStyle, primaryButtonStyle } from "../../components/auth/form-styles";
import { validEmail } from "./signup-validation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validEmail(email) && password.length > 0) setMessage("로그인 기능은 준비 중이에요. 입력한 정보는 전송되지 않았어요.");
  }
  return (
    <AuthCard title="로그인" description="다시 만나 반가워요. 나만의 영화 이야기를 이어가요.">
      <form className="mt-8 space-y-6" onSubmit={submit} noValidate>
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">이메일</label>
          <input id="login-email" className={inputStyle} type="email" autoComplete="email" placeholder="you@example.com"
            value={email} aria-invalid={email.length > 0 && !validEmail(email)} aria-describedby="login-email-help"
            onChange={(event) => { setEmail(event.target.value); setMessage(""); }} />
          <p id="login-email-help" className="mt-2 min-h-4 text-xs text-red-600">{email.length > 0 && !validEmail(email) ? "올바른 이메일 형식으로 입력해 주세요." : ""}</p>
        </div>
        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">비밀번호</label>
          <input id="login-password" className={inputStyle} type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요"
            value={password} onChange={(event) => { setPassword(event.target.value); setMessage(""); }} />
        </div>
        {message && <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">{message}</p>}
        <button type="submit" className={primaryButtonStyle} disabled={!validEmail(email) || password.length === 0}>로그인</button>
      </form>
      <p className="mt-7 text-center text-sm text-slate-500">아직 계정이 없나요? <Link to="/signup" className="ml-1 font-bold text-blue-700">회원가입</Link></p>
      <Link to="/mypage" className="mt-6 block text-center text-xs text-slate-500 underline underline-offset-4">내 정보 화면 미리보기</Link>
    </AuthCard>
  );
}
