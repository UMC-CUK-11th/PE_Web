import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import "./auth-pages.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: form.email.trim(), password: form.password });
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <h1 id="login-title" className="auth-title">로그인</h1>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="auth-field">
            <label htmlFor="login-email">이메일</label>
            <div className="auth-input-wrap">
              <img className="auth-input-icon" src="/icons/movie-icons/mail.svg" alt="" aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="off"
                value={form.email}
                disabled={loginMutation.isPending}
                onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))}
                placeholder="name@example.com"
                className="auth-input auth-input-with-icon"
                required
              />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">비밀번호</label>
            <div className="auth-input-wrap">
              <img className="auth-input-icon" src="/icons/movie-icons/lock.svg" alt="" aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                disabled={loginMutation.isPending}
                onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))}
                placeholder="비밀번호"
                className="auth-input auth-input-with-icon"
                required
              />
            </div>
          </div>
          {loginMutation.isError && <p className="auth-error" role="alert">{getApiErrorMessage(loginMutation.error, "로그인하지 못했어요. 서버 연결과 입력 내용을 확인해 주세요.")}</p>}
          <button className="auth-submit" type="submit" disabled={!canSubmit || loginMutation.isPending}>{loginMutation.isPending ? "로그인 중" : "로그인"}</button>
        </form>
        <p className="auth-switch">처음이신가요? <Link to="/signup">회원가입</Link></p>
      </section>
    </main>
  );
}
