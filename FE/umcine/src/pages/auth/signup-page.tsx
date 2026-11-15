import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ApiError, memberErrorMessage } from "../../api/api-client";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { AuthCard } from "../../components/auth/auth-card";
import { inputStyle, primaryButtonStyle } from "../../components/auth/form-styles";
import { validEmail, validNickname, validPassword } from "./signup-validation";

const EMPTY_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
type DuplicateKey = "email" | "nickname";
type DuplicateStatus = "idle" | "checking" | "available" | "taken" | "error";
type DuplicateCheck = { status: DuplicateStatus; value: string; message: string };
const EMPTY_CHECK: DuplicateCheck = { status: "idle", value: "", message: "" };

export function SignupPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [checks, setChecks] = useState({ email: EMPTY_CHECK, nickname: EMPTY_CHECK });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const submitting = useRef(false);
  const checking = useRef({ email: false, nickname: false });

  const valid = {
    email: validEmail(form.email), nickname: validNickname(form.nickname),
    password: validPassword(form.password),
    passwordConfirm: form.passwordConfirm.length > 0 && form.passwordConfirm === form.password,
  };
  const canSubmit = Object.values(valid).every(Boolean) &&
    checks.email.status === "available" && checks.email.value === form.email.trim() &&
    checks.nickname.status === "available" && checks.nickname.value === form.nickname.trim();

  function change(key: keyof typeof EMPTY_FORM, value: string) {
    if (submitting.current || (key === "email" || key === "nickname") && checking.current[key]) return;
    setForm((previous) => ({ ...previous, [key]: value }));
    if (key === "email" || key === "nickname") setChecks((previous) => ({ ...previous, [key]: EMPTY_CHECK }));
    setError("");
    setSuccess("");
  }

  async function check(key: DuplicateKey) {
    if (!valid[key] || checking.current[key] || submitting.current) return;
    checking.current[key] = true;
    const value = form[key].trim();
    const label = key === "email" ? "이메일" : "닉네임";
    setChecks((previous) => ({ ...previous, [key]: { status: "checking", value, message: "확인 중이에요." } }));
    try {
      const response = await (key === "email" ? checkEmailDuplicate(value) : checkNicknameDuplicate(value));
      if (typeof response.available !== "boolean") throw new Error("Invalid availability response");
      setChecks((previous) => ({ ...previous, [key]: {
        status: response.available ? "available" : "taken", value,
        message: response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`,
      } }));
    } catch (cause) {
      setChecks((previous) => ({ ...previous, [key]: { status: "error", value, message: memberErrorMessage(cause) } }));
    } finally {
      checking.current[key] = false;
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    submitting.current = true;
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      setSuccess(response.message);
      setForm(EMPTY_FORM);
      setChecks({ email: EMPTY_CHECK, nickname: EMPTY_CHECK });
    } catch (cause) {
      setError(memberErrorMessage(cause));
      // 사전 확인 후 다른 사용자가 먼저 가입했을 수 있으므로 해당 확인을 무효화합니다.
      if (cause instanceof ApiError && cause.status === 409) {
        const key = cause.code === "MEMBER4091" ? "email" : cause.code === "MEMBER4092" ? "nickname" : null;
        setChecks((previous) => key
          ? { ...previous, [key]: { status: "taken", value: form[key].trim(), message: cause.message } }
          : { email: EMPTY_CHECK, nickname: EMPTY_CHECK });
      }
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="회원가입" description="취향을 나누는 첫걸음, UMCine과 함께 시작해요.">
      <form className="mt-7 space-y-5" onSubmit={submit} noValidate aria-busy={isSubmitting}>
        {(["email", "nickname"] as const).map((key) => {
          const label = key === "email" ? "이메일" : "닉네임";
          const invalid = form[key].length > 0 && !valid[key];
          const state = checks[key];
          return (
            <div key={key}>
              <label className="mb-2 block text-sm font-semibold" htmlFor={`signup-${key}`}>{label}</label>
              <div className="flex gap-2">
                <input id={`signup-${key}`} type={key === "email" ? "email" : "text"}
                  className={inputStyle} autoComplete={key === "email" ? "email" : "nickname"}
                  placeholder={key === "email" ? "you@example.com" : "2~12자로 입력해 주세요"}
                  value={form[key]} disabled={isSubmitting || state.status === "checking"}
                  aria-invalid={invalid || state.status === "taken"} aria-describedby={`signup-${key}-help`}
                  onChange={(event) => change(key, event.target.value)} />
                <button type="button" onClick={() => void check(key)} disabled={!valid[key] || isSubmitting || state.status === "checking"}
                  aria-label={`${label} 중복 확인`}
                  className="shrink-0 rounded-xl border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400">
                  {state.status === "checking" ? "확인 중…" : "중복 확인"}
                </button>
              </div>
              <p id={`signup-${key}-help`} aria-live="polite"
                className={`mt-2 min-h-4 text-xs ${invalid || state.status === "taken" || state.status === "error" ? "text-red-600" : state.status === "available" ? "text-emerald-700" : "text-slate-500"}`}>
                {invalid ? key === "email" ? "올바른 이메일 형식으로 입력해 주세요." : "닉네임은 2~12자로 입력해 주세요."
                  : state.message || `${label}을 입력한 뒤 중복 확인을 해 주세요.`}
              </p>
            </div>
          );
        })}
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="signup-password">비밀번호</label>
          <input id="signup-password" className={inputStyle} type="password" autoComplete="new-password"
            placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상" value={form.password}
            disabled={isSubmitting} onChange={(event) => change("password", event.target.value)}
            aria-invalid={form.password.length > 0 && !valid.password} aria-describedby="signup-password-help" />
          <p id="signup-password-help" className={`mt-2 text-xs leading-5 ${form.password.length > 0 && !valid.password ? "text-red-600" : "text-slate-500"}`}>
            영문 대소문자·숫자·특수문자(!@#$%^&*)를 포함한 8~72자로 입력해 주세요.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="signup-password-confirm">비밀번호 확인</label>
          <input id="signup-password-confirm" className={inputStyle} type="password" autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해 주세요" value={form.passwordConfirm} disabled={isSubmitting}
            onChange={(event) => change("passwordConfirm", event.target.value)}
            aria-invalid={form.passwordConfirm.length > 0 && !valid.passwordConfirm} aria-describedby="signup-password-confirm-help" />
          <p id="signup-password-confirm-help" aria-live="polite" className="mt-2 min-h-4 text-xs text-red-600">
            {form.passwordConfirm.length > 0 && !valid.passwordConfirm ? "비밀번호가 일치하지 않아요." : ""}
          </p>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <div role="status" className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
          <p className="font-bold">{success}</p>
          <Link to="/login" className="mt-2 inline-block underline underline-offset-4">로그인 화면으로 이동</Link>
        </div>}
        <button className={primaryButtonStyle} disabled={!canSubmit || isSubmitting} type="submit">{isSubmitting ? "가입 중…" : "가입하기"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">이미 계정이 있나요? <Link to="/login" className="ml-1 font-bold text-blue-700">로그인</Link></p>
    </AuthCard>
  );
}
