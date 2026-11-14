import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { buttonClass, inputClass, linkClass, MemberForm } from "../components/member-form";
import { useLoginMutation } from "../hooks/use-login-mutation";
import { emailError } from "../utils/member-validation";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const invalidEmail = email ? emailError(email) : "";
  const canSubmit = !emailError(email) && password.length > 0;

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || loginMutation.isPending) return;
    loginMutation.mutate({ email: email.trim(), password });
  }

  return <MemberForm title="로그인">
    <form onSubmit={submit} className="space-y-5" noValidate aria-busy={loginMutation.isPending}>
      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">이메일</label>
        <input id="login-email" className={inputClass} type="email" autoComplete="email" value={email} required
          aria-invalid={Boolean(invalidEmail)} aria-describedby="login-email-error"
          onChange={event => setEmail(event.target.value)} />
        <p id="login-email-error" className="mt-1 text-sm text-red-600" aria-live="polite">{invalidEmail}</p>
      </div>
      <div>
        <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">비밀번호</label>
        <input id="login-password" className={inputClass} type="password" autoComplete="current-password" value={password} required
          onChange={event => setPassword(event.target.value)} />
      </div>
      <button type="submit" className={`${buttonClass} w-full`} disabled={!canSubmit || loginMutation.isPending}>
        {loginMutation.isPending ? "로그인 중" : "로그인"}
      </button>
    </form>
    <p className="mt-6 text-sm text-gray-600">계정이 없나요? <Link to="/signup" className={linkClass}>회원가입</Link></p>
  </MemberForm>;
}
