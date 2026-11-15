import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const INITIAL_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
type Field = keyof typeof INITIAL_FORM;
type DuplicateField = "email" | "nickname";
const UNCHECKED = { isChecking: false, isAvailable: false, message: "" };

export function SignupPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [checks, setChecks] = useState({ email: UNCHECKED, nickname: UNCHECKED });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState("");
  const submitting = useRef(false);
  const checking = useRef({ email: false, nickname: false });
  const valid = {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12,
    password: PASSWORD_REGEX.test(form.password),
    passwordConfirm: form.passwordConfirm.length > 0 && form.password === form.passwordConfirm,
  };
  const canSubmit = Object.values(valid).every(Boolean) && checks.email.isAvailable && checks.nickname.isAvailable;
  const labels = { email: "이메일", nickname: "닉네임", password: "비밀번호", passwordConfirm: "비밀번호 확인" };
  const errors = {
    email: "올바른 이메일 형식으로 입력해 주세요.",
    nickname: "닉네임은 2자 이상 12자 이하로 입력해 주세요.",
    password: "영문 대문자·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.",
    passwordConfirm: "비밀번호가 일치하지 않아요.",
  };

  function change(key: Field, value: string) {
    if (submitting.current || ((key === "email" || key === "nickname") && checking.current[key])) return;
    setForm(previous => ({ ...previous, [key]: value }));
    setResult("");
    if (key === "email" || key === "nickname") setChecks(previous => ({ ...previous, [key]: UNCHECKED }));
  }

  async function check(key: DuplicateField) {
    if (!valid[key] || checking.current[key] || submitting.current) return;
    checking.current[key] = true;
    setChecks(previous => ({ ...previous, [key]: { ...UNCHECKED, isChecking: true } }));
    try {
      const response = key === "email"
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim());
      const message = response.available ? `사용할 수 있는 ${labels[key]}이에요.` : `이미 사용 중인 ${labels[key]}이에요.`;
      setChecks(previous => ({ ...previous, [key]: { isChecking: false, isAvailable: response.available, message } }));
    } catch {
      setChecks(previous => ({ ...previous, [key]: { ...UNCHECKED, message: "중복 확인에 실패했어요. 다시 시도해 주세요." } }));
    } finally {
      checking.current[key] = false;
    }
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    submitting.current = true;
    setIsSubmitting(true);
    setResult("");
    try {
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      setResult(response.message);
    } catch {
      setResult("회원가입에 실패했어요. 입력 내용을 확인하고 다시 시도해 주세요.");
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-14">
      <h1 className="mb-8 text-3xl font-bold">회원가입</h1>
      <form onSubmit={submit} noValidate className="space-y-6">
        {(Object.keys(form) as Field[]).map(key => {
          const duplicateField = key === "email" || key === "nickname" ? key : null;
          const error = form[key].length > 0 && !valid[key];
          return <div key={key}>
            <label htmlFor={`signup-${key}`} className="mb-2 block font-medium">{labels[key]}</label>
            <div className="flex gap-2">
              <input id={`signup-${key}`} name={key} type={key.startsWith("password") ? "password" : key === "email" ? "email" : "text"}
                autoComplete={key.startsWith("password") ? "new-password" : key === "email" ? "email" : "nickname"}
                value={form[key]} onChange={event => change(key, event.target.value)}
                disabled={isSubmitting || (duplicateField !== null && checks[duplicateField].isChecking)}
                aria-invalid={error} aria-describedby={error ? `signup-${key}-error` : undefined}
                className="min-w-0 flex-1 rounded-lg border border-gray-600 bg-[#202229] px-4 py-3 disabled:opacity-50" />
              {duplicateField && <button type="button" onClick={() => check(duplicateField)}
                disabled={!valid[key] || checks[duplicateField].isChecking || isSubmitting}
                className="rounded-lg bg-gray-700 px-4 disabled:opacity-40">
                {checks[duplicateField].isChecking ? "확인 중" : "중복 확인"}
              </button>}
            </div>
            {error && <p id={`signup-${key}-error`} className="mt-2 text-sm text-red-400">{errors[key]}</p>}
            {duplicateField && <p role="status" className="mt-2 text-sm">{checks[duplicateField].message}</p>}
          </div>;
        })}
        <button type="submit" disabled={!canSubmit || isSubmitting} className="w-full rounded-lg bg-red-600 py-3 font-bold disabled:opacity-40">
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        <p role="status">{result}</p>
      </form>
      <p className="mt-6 text-center text-gray-400">이미 계정이 있나요? <Link to="/login" className="text-white underline">로그인</Link></p>
    </main>
  );
}
