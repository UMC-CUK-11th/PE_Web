import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import AuthPanel from "../../components/auth/auth-panel";
import {
  buttonClassName,
  inputClassName,
  linkClassName,
} from "../../components/auth/form-styles";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("로그인 기능을 준비 중이에요.");
  }

  return (
    <AuthPanel
      title="로그인"
      description="다시 만나 반가워요. 오늘은 어떤 영화를 만나볼까요?"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold">
            이메일
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setMessage("");
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
            required
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setMessage("");
            }}
            className={inputClassName}
          />
        </div>
        <button
          disabled={!email || !password}
          className={`${buttonClassName} w-full`}
        >
          로그인
        </button>
        <p role="status" className="text-sm text-zinc-500">
          {message}
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        처음 오셨나요?{" "}
        <Link to="/signup" className={linkClassName}>
          회원가입
        </Link>
      </p>
    </AuthPanel>
  );
}
