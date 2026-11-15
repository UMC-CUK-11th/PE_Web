import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateKey = "email" | "nickname";
type DuplicateResult = { isChecking: boolean; isAvailable: boolean };
const EMPTY_CHECK: DuplicateResult = { isChecking: false, isAvailable: false };
const inputClass = "h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none placeholder:text-[#a4aab5] focus:border-[#3678ff]";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState<Record<DuplicateKey, DuplicateResult>>({
    email: { ...EMPTY_CHECK },
    nickname: { ...EMPTY_CHECK },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError = form.passwordConfirm.length > 0 && !isPasswordConfirmValid;
  const canSubmit = isEmailValid && isNicknameValid && isPasswordValid &&
    isPasswordConfirmValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: FormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...EMPTY_CHECK } }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;
    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: true, isAvailable: false } }));
    try {
      const response = key === "email"
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim());
      setDuplicateCheck((prev) => ({ ...prev, [key]: { isChecking: false, isAvailable: response.available } }));
      window.alert(response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...EMPTY_CHECK } }));
      window.alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      if (!response.isSuccess) throw new Error(response.message);
      window.alert(response.message);
      await navigate({ to: "/login" });
    } catch {
      window.alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-[440px]">
        <h1 className="mb-7 text-[32px] font-bold tracking-tight">회원가입</h1>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="signup-email">이메일</label>
            <div className="relative">
              <input className={`${inputClass} pr-24`} id="signup-email" type="email" autoComplete="email" placeholder="이메일을 입력해 주세요" value={form.email} onChange={(e) => handleChangeField("email", e.target.value)} disabled={duplicateCheck.email.isChecking} aria-invalid={showEmailError} aria-describedby={showEmailError ? "signup-email-error" : undefined} />
              <button className="absolute inset-y-0 right-3 px-1 text-xs font-bold text-[#2669ee] disabled:text-[#a4aab5]" type="button" disabled={!isEmailValid || duplicateCheck.email.isChecking} onClick={() => void handleCheckDuplicate("email")}>{duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}</button>
            </div>
            {showEmailError && <p className="mt-2 text-xs text-[#f04438]" id="signup-email-error">이메일 형식을 확인해 주세요.</p>}
            {duplicateCheck.email.isAvailable && <p className="mt-2 text-xs text-[#168a5b]">사용 가능한 이메일이에요.</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="signup-nickname">닉네임</label>
            <div className="relative">
              <input className={`${inputClass} pr-24`} id="signup-nickname" type="text" autoComplete="nickname" placeholder="2~12자" value={form.nickname} onChange={(e) => handleChangeField("nickname", e.target.value)} disabled={duplicateCheck.nickname.isChecking} aria-invalid={showNicknameError} aria-describedby={showNicknameError ? "signup-nickname-error" : undefined} />
              <button className="absolute inset-y-0 right-3 px-1 text-xs font-bold text-[#2669ee] disabled:text-[#a4aab5]" type="button" disabled={!isNicknameValid || duplicateCheck.nickname.isChecking} onClick={() => void handleCheckDuplicate("nickname")}>{duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}</button>
            </div>
            {showNicknameError && <p className="mt-2 text-xs text-[#f04438]" id="signup-nickname-error">닉네임은 2~12자로 입력해 주세요.</p>}
            {duplicateCheck.nickname.isAvailable && <p className="mt-2 text-xs text-[#168a5b]">사용 가능한 닉네임이에요.</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="signup-password">비밀번호</label>
            <input className={inputClass} id="signup-password" type="password" autoComplete="new-password" placeholder="8자 이상" value={form.password} onChange={(e) => handleChangeField("password", e.target.value)} aria-invalid={showPasswordError} />
            <p className="mt-2 text-xs text-[#a4aab5]">영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요.</p>
            {showPasswordError && <p className="mt-2 text-xs text-[#f04438]">비밀번호 조건을 확인해 주세요.</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="signup-password-confirm">비밀번호 확인</label>
            <input className={inputClass} id="signup-password-confirm" type="password" autoComplete="new-password" placeholder="다시 입력" value={form.passwordConfirm} onChange={(e) => handleChangeField("passwordConfirm", e.target.value)} aria-invalid={showPasswordConfirmError} />
            {showPasswordConfirmError && <p className="mt-2 text-xs text-[#f04438]">비밀번호가 일치하지 않아요.</p>}
          </div>
          <button className="h-12 w-full rounded-lg bg-[#2669ee] text-sm font-bold text-white disabled:bg-[#9bb5f2]" type="submit" disabled={!canSubmit || isSubmitting}>{isSubmitting ? "가입 중" : "가입하기"}</button>
        </form>
        <p className="mt-6 text-center text-xs text-[#a4aab5]">이미 계정이 있나요? <Link className="font-bold text-[#2669ee]" to="/login">로그인</Link></p>
      </div>
    </main>
  );
}
