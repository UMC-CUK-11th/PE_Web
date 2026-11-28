"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import "./signup-page.css";
import "./login-page.css";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <main className="signup-page login-page">
      <section className="signup-panel" aria-labelledby="login-title">
        <h1 id="login-title">로그인</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="login-email">이메일</label>
            <div className="signup-input-row login-input-row">
              <img src="/movie-icons/mail.svg" alt="" />
              <input id="login-email" name="email" type="email" autoComplete="email" required
                placeholder="name@example.com" value={email} onChange={(event) => { setEmail(event.target.value); }} />
            </div>
          </div>
          <div className="signup-field">
            <label htmlFor="login-password">비밀번호</label>
            <div className="signup-input-row login-input-row">
              <img src="/movie-icons/lock.svg" alt="" />
              <input id="login-password" name="password" type="password" autoComplete="current-password" required
                placeholder="비밀번호" value={password} onChange={(event) => { setPassword(event.target.value); }} />
            </div>
          </div>
          <button className="signup-submit" type="submit" disabled={!canSubmit || loginMutation.isPending}>
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>
        <p className="signup-login">처음이신가요? <Link href="/signup">회원가입</Link></p>
      </section>
    </main>
  );
}
