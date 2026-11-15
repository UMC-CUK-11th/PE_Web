import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { AuthCard, AuthField } from "../../components/auth/auth-ui";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
const DEFAULT_DUPLICATE_CHECK = { isChecking: false, isAvailable: false, message: "" };
type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK, nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password) && new TextEncoder().encode(form.password).length <= 72;
  const isPasswordConfirmValid = form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;
  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;
  const canSubmit = isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FormKey, value: string) {
    if (isSubmitting) return;
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 중복 확인은 그때 검사한 값에만 유효하다. 입력을 바꾸면 다시 확인한다.
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
    setResultMessage("");
    setIsSuccess(false);
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking || isSubmitting) return;
    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({ ...prev, [key]: { ...DEFAULT_DUPLICATE_CHECK, isChecking: true } }));
    try {
      const response = key === "email"
        ? await checkEmailDuplicate(form.email.trim())
        : await checkNicknameDuplicate(form.nickname.trim());
      const message = response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable: response.available, message } }));
      window.alert(message);
    } catch {
      const message = "중복 확인에 실패했어요. 다시 시도해 주세요.";
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable: false, message } }));
      window.alert(message);
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: false } }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting || isSuccess) return;
    setIsSubmitting(true);
    setResultMessage("");
    try {
      // 비밀번호 확인은 화면에서만 검사한다. 요청에는 세 필드만 보낸다.
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      setIsSuccess(true);
      setResultMessage(response.message);
      window.alert(response.message);
    } catch {
      const message = "회원가입에 실패했어요. 입력값을 확인하고 다시 시도해 주세요.";
      setResultMessage(message);
      window.alert(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function duplicateButton(key: DuplicateCheckKey, valid: boolean) {
    return <button type="button" onClick={() => void handleCheckDuplicate(key)}
      disabled={!valid || duplicateCheck[key].isChecking || isSubmitting}
      className="shrink-0 px-3 text-xs font-semibold text-[#536be8] disabled:text-gray-400">
      {duplicateCheck[key].isChecking ? "확인 중" : "중복 확인"}
    </button>;
  }

  return <AuthCard title="회원가입" description="UMCine에서 나만의 영화 취향을 발견해 보세요.">
    <form onSubmit={handleSubmit} noValidate>
      <fieldset disabled={isSubmitting} className="space-y-5">
        <AuthField id="signup-email" label="이메일" type="email" autoComplete="email" placeholder="example@email.com"
          value={form.email} onChange={(event) => handleChangeField("email", event.target.value)}
          disabled={duplicateCheck.email.isChecking}
          error={form.email.length > 0 && !isEmailValid ? "올바른 이메일 형식을 입력해 주세요." : undefined}
          hint={duplicateCheck.email.message} action={duplicateButton("email", isEmailValid)} />
        <AuthField id="signup-nickname" label="닉네임" autoComplete="nickname" placeholder="닉네임을 입력해 주세요"
          value={form.nickname} onChange={(event) => handleChangeField("nickname", event.target.value)}
          disabled={duplicateCheck.nickname.isChecking}
          error={form.nickname.length > 0 && !isNicknameValid ? "닉네임은 2~12자로 입력해 주세요." : undefined}
          hint={duplicateCheck.nickname.message || "2~12자로 입력해 주세요."} action={duplicateButton("nickname", isNicknameValid)} />
        <AuthField id="signup-password" label="비밀번호" type="password" autoComplete="new-password" placeholder="비밀번호를 입력해 주세요"
          value={form.password} onChange={(event) => handleChangeField("password", event.target.value)}
          error={form.password.length > 0 && !isPasswordValid ? "대문자·소문자·숫자·특수문자를 포함해 8자 이상, 72바이트 이하로 입력해 주세요." : undefined}
          hint="영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 주세요." />
        <AuthField id="signup-password-confirm" label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호를 다시 입력해 주세요"
          value={form.passwordConfirm} onChange={(event) => handleChangeField("passwordConfirm", event.target.value)}
          error={form.passwordConfirm.length > 0 && !isPasswordConfirmValid ? "비밀번호가 일치하지 않아요." : undefined} />
      </fieldset>
      {resultMessage && <p className={`mt-5 rounded-lg p-3 text-sm ${isSuccess ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}
        role={isSuccess ? "status" : "alert"}>{resultMessage}</p>}
      <button type="submit" disabled={!canSubmit || isSubmitting || isSuccess}
        className="mt-6 w-full rounded-lg bg-[#536be8] py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500">
        {isSubmitting ? "가입 중" : isSuccess ? "가입 완료" : "가입하기"}
      </button>
    </form>
    <p className="mt-6 text-center text-sm text-gray-500">이미 계정이 있으신가요? <Link to="/login" className="ml-1 font-semibold text-[#536be8]">로그인</Link></p>
  </AuthCard>;
}
