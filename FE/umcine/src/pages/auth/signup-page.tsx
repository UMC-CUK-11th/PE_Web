import { useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmail, checkNickname, signup } from "../../api/members";
import AuthPanel from "../../components/auth/auth-panel";
import {
  buttonClassName,
  inputClassName,
  linkClassName,
} from "../../components/auth/form-styles";
import { useDuplicateCheck } from "../../hooks/use-duplicate-check";
import { validateSignup } from "../../utils/auth/validation";
import { getRequestErrorMessage } from "../../utils/auth/request-error";

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const submitting = useRef(false);
  const valid = validateSignup({ email, nickname, password, passwordConfirm });
  const emailCheck = useDuplicateCheck(
    email,
    valid.email,
    "이메일",
    checkEmail,
  );
  const nicknameCheck = useDuplicateCheck(
    nickname,
    valid.nickname,
    "닉네임",
    checkNickname,
  );
  const canSubmit =
    Object.values(valid).every(Boolean) &&
    emailCheck.isAvailable &&
    nicknameCheck.isAvailable &&
    !emailCheck.isChecking &&
    !nicknameCheck.isChecking &&
    !isSubmitting &&
    !feedback?.success;
  const remainingChecks = [
    !valid.email ? "이메일 형식" : !emailCheck.isAvailable && "이메일 중복 확인",
    !valid.nickname
      ? "닉네임 2~12자"
      : !nicknameCheck.isAvailable && "닉네임 중복 확인",
    !valid.password && "비밀번호 조건",
    !valid.passwordConfirm && "비밀번호 확인",
  ].filter(Boolean);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitting.current) return;
    submitting.current = true;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await signup({ email, nickname, password });
      setFeedback({ success: true, message: response.message });
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      setFeedback({
        success: false,
        message: getRequestErrorMessage(
          error,
          "회원가입에 실패했어요. 다시 시도해 주세요.",
        ),
      });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPanel
      title="회원가입"
      description="나만의 영화 취향을 발견하는 첫걸음, UMCine과 함께해요."
    >
      <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <fieldset
          disabled={isSubmitting || feedback?.success}
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-bold"
            >
              이메일
            </label>
            <div className="flex gap-2">
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                disabled={emailCheck.isChecking}
                aria-invalid={email.length > 0 && !valid.email}
                aria-describedby="signup-email-feedback"
                onChange={(event) => {
                  setEmail(event.target.value);
                  emailCheck.reset();
                  setFeedback(null);
                }}
                className={inputClassName}
                placeholder="you@example.com"
              />
              <button
                type="button"
                disabled={!valid.email || emailCheck.isChecking}
                onClick={() => {
                  void emailCheck.check();
                }}
                className={`${buttonClassName} shrink-0`}
              >
                {emailCheck.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p
              id="signup-email-feedback"
              role="status"
              className={`mt-2 text-xs ${emailCheck.isAvailable ? "text-emerald-700" : "text-red-600"}`}
            >
              {email.length > 0 && !valid.email
                ? "올바른 이메일 형식을 입력해주세요."
                : emailCheck.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="signup-nickname"
              className="mb-2 block text-sm font-bold"
            >
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                id="signup-nickname"
                name="nickname"
                autoComplete="nickname"
                required
                value={nickname}
                disabled={nicknameCheck.isChecking}
                aria-invalid={nickname.length > 0 && !valid.nickname}
                aria-describedby="signup-nickname-feedback"
                onChange={(event) => {
                  setNickname(event.target.value);
                  nicknameCheck.reset();
                  setFeedback(null);
                }}
                className={inputClassName}
                placeholder="2~12자 닉네임"
              />
              <button
                type="button"
                disabled={!valid.nickname || nicknameCheck.isChecking}
                onClick={() => {
                  void nicknameCheck.check();
                }}
                className={`${buttonClassName} shrink-0`}
              >
                {nicknameCheck.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            <p
              id="signup-nickname-feedback"
              role="status"
              className={`mt-2 text-xs ${nicknameCheck.isAvailable ? "text-emerald-700" : "text-red-600"}`}
            >
              {nickname.length > 0 && !valid.nickname
                ? "닉네임은 2자 이상 12자 이하로 입력해주세요."
                : nicknameCheck.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-sm font-bold"
            >
              비밀번호
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              aria-invalid={password.length > 0 && !valid.password}
              aria-describedby="signup-password-help signup-password-error"
              onChange={(event) => {
                setPassword(event.target.value);
                setFeedback(null);
              }}
              className={inputClassName}
            />
            <p
              id="signup-password-help"
              className="mt-2 text-xs leading-5 text-zinc-500"
            >
              영문 대/소문자, 숫자, 특수문자 !@#$%^&*를 포함해 8자 이상
              입력해주세요.
            </p>
            {password.length > 0 && !valid.password && (
              <p
                id="signup-password-error"
                className="mt-2 text-xs text-red-600"
              >
                영문 대/소문자, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-password-confirm"
              className="mb-2 block text-sm font-bold"
            >
              비밀번호 확인
            </label>
            <input
              id="signup-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              required
              value={passwordConfirm}
              aria-invalid={
                passwordConfirm.length > 0 && !valid.passwordConfirm
              }
              aria-describedby="signup-password-confirm-error"
              onChange={(event) => {
                setPasswordConfirm(event.target.value);
                setFeedback(null);
              }}
              className={inputClassName}
            />
            {passwordConfirm.length > 0 && !valid.passwordConfirm && (
              <p
                id="signup-password-confirm-error"
                className="mt-2 text-xs text-red-600"
              >
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
          {!feedback?.success && !isSubmitting && remainingChecks.length > 0 && (
            <p role="status" className="text-xs leading-5 text-zinc-500">
              가입 전에 확인할 항목 · {remainingChecks.join(", ")}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`${buttonClassName} w-full`}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </fieldset>
        {feedback && (
          <p
            role={feedback.success ? "status" : "alert"}
            className={`mt-4 rounded-xl p-3 text-sm ${feedback.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
          >
            {feedback.message}
          </p>
        )}
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        이미 계정이 있나요?{" "}
        <Link to="/login" className={linkClassName}>
          로그인
        </Link>
      </p>
    </AuthPanel>
  );
}
