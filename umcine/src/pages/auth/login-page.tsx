import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import "./signup-page.css";
import "./login-page.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setNotice("입력값을 확인했어요. 퍼블리싱 화면으로, 아직 로그인 API는 연결하지 않았습니다.");
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
                placeholder="name@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setNotice(""); }} />
            </div>
          </div>
          <div className="signup-field">
            <label htmlFor="login-password">비밀번호</label>
            <div className="signup-input-row login-input-row">
              <img src="/movie-icons/lock.svg" alt="" />
              <input id="login-password" name="password" type="password" autoComplete="current-password" required
                placeholder="비밀번호" value={password} onChange={(event) => { setPassword(event.target.value); setNotice(""); }} />
            </div>
          </div>
          <button className="signup-submit" type="submit" disabled={!canSubmit}>로그인</button>
          {notice && <p className="signup-notice" role="status">{notice}</p>}
        </form>
        <p className="signup-login">처음이신가요? <Link to="/signup">회원가입</Link></p>
      </section>
    </main>
  );
}
