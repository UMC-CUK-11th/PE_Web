import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

const labelClassName = "mb-1.5 block text-sm font-semibold";
const inputClassName =
  "h-12 w-full rounded-md border border-[#e0e4ea] bg-white px-3.5 text-sm placeholder:text-[#858e9d] focus-visible:border-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2563eb] disabled:bg-[#f6f7f9] aria-invalid:border-red-600";
const errorClassName = "mt-1 text-xs text-red-700";
const checkButtonClassName =
  "absolute inset-y-0 right-0 cursor-pointer rounded-r-md px-3.5 text-xs font-bold text-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50";
const passwordHelp =
  "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    const value = form[key].trim();
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    let isAvailable = false;
    try {
      const response = key === "email"
        ? await checkEmailDuplicate(value)
        : await checkNicknameDuplicate(value);
      isAvailable = response.available === true;
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: false, isAvailable },
      }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section className="w-full max-w-[428px]" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-5 text-[32px] leading-tight font-extrabold tracking-tight">
          회원가입
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className={labelClassName} htmlFor="signup-email">이메일</label>
            <div className="relative">
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                className={cn(inputClassName, "pr-24")}
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                disabled={duplicateCheck.email.isChecking}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "signup-email-error" : undefined}
                required
              />
              <button
                type="button"
                className={checkButtonClassName}
                aria-label={duplicateCheck.email.isChecking ? "이메일 중복 확인 중" : "이메일 중복 확인"}
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showEmailError && (
              <p id="signup-email-error" className={errorClassName}>올바른 이메일 주소를 입력해 주세요.</p>
            )}
          </div>

          <div>
            <label className={labelClassName} htmlFor="signup-nickname">닉네임</label>
            <div className="relative">
              <input
                id="signup-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                className={cn(inputClassName, "pr-24")}
                placeholder="2–12자"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                disabled={duplicateCheck.nickname.isChecking}
                aria-invalid={showNicknameError}
                aria-describedby={showNicknameError ? "signup-nickname-error" : undefined}
                required
              />
              <button
                type="button"
                className={checkButtonClassName}
                aria-label={duplicateCheck.nickname.isChecking ? "닉네임 중복 확인 중" : "닉네임 중복 확인"}
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {showNicknameError && (
              <p id="signup-nickname-error" className={errorClassName}>닉네임을 2~12자로 입력해 주세요.</p>
            )}
          </div>

          <div>
            <label className={labelClassName} htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              className={inputClassName}
              placeholder="8자 이상"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              aria-invalid={showPasswordError}
              aria-describedby="signup-password-help"
              required
            />
            <p
              id="signup-password-help"
              className={showPasswordError ? errorClassName : "mt-1 text-xs text-[#667080]"}
            >
              {showPasswordError
                ? "비밀번호는 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함한 8자 이상이어야 해요."
                : passwordHelp}
            </p>
          </div>

          <div>
            <label className={labelClassName} htmlFor="signup-password-confirm">비밀번호 확인</label>
            <input
              id="signup-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              className={inputClassName}
              placeholder="다시 입력"
              value={form.passwordConfirm}
              onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
              aria-invalid={showPasswordConfirmError}
              aria-describedby={showPasswordConfirmError ? "signup-password-confirm-error" : undefined}
              required
            />
            {showPasswordConfirmError && (
              <p id="signup-password-confirm-error" className={errorClassName}>비밀번호가 일치하지 않아요.</p>
            )}
          </div>

          <button
            type="submit"
            className="h-[46px] w-full cursor-pointer rounded-md bg-[#2563eb] text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#789af0]"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#667080]">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-[#2563eb] hover:underline">로그인</Link>
        </p>
      </section>
    </main>
  );
}
