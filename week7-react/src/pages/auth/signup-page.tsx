import { useRef, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { checkEmail, checkNickname, signup } from "../../api/member";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

export function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const [emailMessage, setEmailMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingNickname, setCheckingNickname] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const emailRef = useRef("");
  const nicknameRef = useRef("");
  const emailRequestId = useRef(0);
  const nicknameRequestId = useRef(0);

  // 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    emailChecked &&
    nicknameChecked &&
    !checkingEmail &&
    !checkingNickname;

  // 입력값 변경
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "email") {
      emailRef.current = value;
      emailRequestId.current += 1;
      setEmailChecked(false);
      setEmailMessage("");
      setCheckingEmail(false);
    }

    if (key === "nickname") {
      nicknameRef.current = value;
      nicknameRequestId.current += 1;
      setNicknameChecked(false);
      setNicknameMessage("");
      setCheckingNickname(false);
    }
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    if (!isEmailValid || checkingEmail) return;

    const checkedValue = form.email.trim();
    const requestId = ++emailRequestId.current;

    setCheckingEmail(true);
    setEmailChecked(false);
    setEmailMessage("");

    try {
      const available = await checkEmail(checkedValue);

      if (
        emailRequestId.current !== requestId ||
        emailRef.current.trim() !== checkedValue
      ) {
        return;
      }

      setEmailChecked(available);
      setEmailMessage(
        available
          ? "사용 가능한 이메일입니다."
          : "이미 사용 중인 이메일입니다.",
      );
    } catch {
      if (emailRequestId.current !== requestId) return;

      setEmailChecked(false);
      setEmailMessage("중복 확인 중 오류가 발생했습니다.");
    } finally {
      if (emailRequestId.current === requestId) {
        setCheckingEmail(false);
      }
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!isNicknameValid || checkingNickname) return;

    const checkedValue = form.nickname.trim();
    const requestId = ++nicknameRequestId.current;

    setCheckingNickname(true);
    setNicknameChecked(false);
    setNicknameMessage("");

    try {
      const available = await checkNickname(checkedValue);

      if (
        nicknameRequestId.current !== requestId ||
        nicknameRef.current.trim() !== checkedValue
      ) {
        return;
      }

      setNicknameChecked(available);
      setNicknameMessage(
        available
          ? "사용 가능한 닉네임입니다."
          : "이미 사용 중인 닉네임입니다.",
      );
    } catch {
      if (nicknameRequestId.current !== requestId) return;

      setNicknameChecked(false);
      setNicknameMessage("중복 확인 중 오류가 발생했습니다.");
    } finally {
      if (nicknameRequestId.current === requestId) {
        setCheckingNickname(false);
      }
    }
  };

  // 실제 회원가입 API 요청
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      alert("회원가입이 완료되었습니다!");
      await navigate({ to: "/login" });
    } catch {
      setSubmitError("회원가입에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-md border bg-white px-3 py-3 text-sm outline-none
    focus:border-blue-500 ${hasError ? "border-red-500" : "border-gray-200"}`;

  return (
    <main className="flex min-h-[calc(100vh-60px)] justify-center bg-gray-100 px-4 pt-32 pb-12">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-[360px]">
        <h1 className="mb-7 text-left text-2xl font-bold">회원가입</h1>

        {/* 이메일 */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold">이메일</label>

          <div className="relative">
            <input
              type="email"
              placeholder="이메일을 입력해 주세요"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`${inputClass(
                form.email.length > 0 && !isEmailValid,
              )} pr-20`}
            />

            <button
              type="button"
              onClick={handleEmailCheck}
              disabled={!isEmailValid || checkingEmail || isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-blue-600 disabled:opacity-100"
            >
              {checkingEmail ? "확인 중..." : "중복 확인"}
            </button>
          </div>

          {form.email && !isEmailValid && (
            <p className="mt-1 text-xs text-red-500">
              이메일 형식을 확인해 주세요.
            </p>
          )}

          {emailMessage && (
            <p
              className={`mt-1 text-xs ${
                emailChecked ? "text-green-600" : "text-red-500"
              }`}
            >
              {emailMessage}
            </p>
          )}
        </div>

        {/* 닉네임 */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold">닉네임</label>

          <div className="relative">
            <input
              type="text"
              placeholder="2~12자"
              value={form.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              className={`${inputClass(
                form.nickname.length > 0 && !isNicknameValid,
              )} pr-20`}
            />

            <button
              type="button"
              onClick={handleNicknameCheck}
              disabled={!isNicknameValid || checkingNickname || isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-blue-600 disabled:opacity-100"
            >
              {checkingNickname ? "확인 중..." : "중복 확인"}
            </button>
          </div>

          {form.nickname && !isNicknameValid && (
            <p className="mt-1 text-xs text-red-500">
              닉네임은 2~12자로 입력해 주세요.
            </p>
          )}

          {nicknameMessage && (
            <p
              className={`mt-1 text-xs ${
                nicknameChecked ? "text-green-600" : "text-red-500"
              }`}
            >
              {nicknameMessage}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold">비밀번호</label>

          <input
            type="password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={inputClass(form.password.length > 0 && !isPasswordValid)}
          />

          <p className="mt-2 text-[11px] text-gray-400">
            영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>

          {form.password && !isPasswordValid && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호 조건을 확인해 주세요.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-semibold">
            비밀번호 확인
          </label>

          <input
            type="password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(e) => handleChange("passwordConfirm", e.target.value)}
            className={inputClass(
              form.passwordConfirm.length > 0 && !isPasswordConfirmValid,
            )}
          />

          {form.passwordConfirm && !isPasswordConfirmValid && (
            <p className="mt-1 text-xs text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* 회원가입 오류 */}
        {submitError && (
          <p className="mb-3 text-center text-xs text-red-500">{submitError}</p>
        )}

        {/* 가입하기 */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isSubmitting ? "가입 중..." : "가입하기"}
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
