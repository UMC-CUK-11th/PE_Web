import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { signup } from "../../api/members/signup";
import { FieldButton, FormField, primaryButtonClass } from "../../components/form/form-field";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
const PASSWORD_HINT = "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요";

const DEFAULT_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateKey = "email" | "nickname";
type DuplicateStatus = "idle" | "checking" | "available" | "taken" | "failed";

const LABEL: Record<DuplicateKey, string> = { email: "이메일", nickname: "닉네임" };
const CHECK: Record<DuplicateKey, (value: string) => Promise<{ available: boolean }>> = {
  email: checkEmail,
  nickname: checkNickname,
};

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicate, setDuplicate] = useState<Record<DuplicateKey, DuplicateStatus>>({
    email: "idle",
    nickname: "idle",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ text: string; tone: "error" | "success" } | null>(null);

  const isValid = {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12,
    password: PASSWORD_REGEX.test(form.password),
    passwordConfirm: form.passwordConfirm.length > 0 && form.password === form.passwordConfirm,
  };
  const canSubmit =
    Object.values(isValid).every(Boolean) &&
    duplicate.email === "available" &&
    duplicate.nickname === "available";

  function handleChange(key: FormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicate[key] === "checking") return;
      // 확인한 값을 바꾸면 다시 확인해야 한다
      setDuplicate((prev) => ({ ...prev, [key]: "idle" }));
    }
    setResult(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheck(key: DuplicateKey) {
    if (!isValid[key] || duplicate[key] === "checking") return;
    setDuplicate((prev) => ({ ...prev, [key]: "checking" }));
    try {
      const { available } = await CHECK[key](form[key].trim());
      setDuplicate((prev) => ({ ...prev, [key]: available ? "available" : "taken" }));
    } catch {
      setDuplicate((prev) => ({ ...prev, [key]: "failed" }));
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    setResult(null);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      setForm(DEFAULT_FORM);
      setDuplicate({ email: "idle", nickname: "idle" });
      setResult({ text: response.message, tone: "success" });
    } catch (error) {
      // 입력값은 그대로 두고 서버가 알려 준 이유를 보여 준다
      const serverMessage =
        isHTTPError(error) && typeof error.data === "object" && error.data && "message" in error.data
          ? String(error.data.message)
          : null;
      setResult({ text: serverMessage ?? "회원가입에 실패했어요. 다시 시도해 주세요.", tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  function duplicateMessage(key: DuplicateKey) {
    const label = LABEL[key];
    if (form[key].length > 0 && !isValid[key]) {
      return {
        text: key === "email" ? "올바른 이메일 형식이 아니에요." : "닉네임은 2자 이상 12자 이하로 입력해 주세요.",
        tone: "error" as const,
      };
    }
    if (duplicate[key] === "available") return { text: `사용할 수 있는 ${label}이에요.`, tone: "success" as const };
    if (duplicate[key] === "taken") return { text: `이미 사용 중인 ${label}이에요.`, tone: "error" as const };
    if (duplicate[key] === "failed") return { text: "중복 확인에 실패했어요. 다시 시도해 주세요.", tone: "error" as const };
    return null;
  }

  function duplicateField(key: DuplicateKey, placeholder: string, type: string) {
    const checking = duplicate[key] === "checking";
    return (
      <FormField
        id={`signup-${key}`}
        label={LABEL[key]}
        type={type}
        autoComplete={key === "email" ? "email" : "nickname"}
        placeholder={placeholder}
        value={form[key]}
        disabled={checking}
        onChange={(event) => handleChange(key, event.target.value)}
        message={duplicateMessage(key)}
        action={
          <FieldButton
            aria-label={`${LABEL[key]} 중복 확인`}
            disabled={!isValid[key] || checking}
            onClick={() => handleCheck(key)}
          >
            {checking ? "확인 중" : "중복 확인"}
          </FieldButton>
        }
      />
    );
  }

  return (
    <main className="flex w-full flex-1 justify-center px-5 py-16">
      <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[440px] flex-col gap-5">
        <h1 className="text-[32px] font-bold">회원가입</h1>
        {duplicateField("email", "name@example.com", "email")}
        {duplicateField("nickname", "2~12자", "text")}
        <FormField
          id="signup-password"
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          placeholder="8자 이상"
          value={form.password}
          onChange={(event) => handleChange("password", event.target.value)}
          message={{
            text: PASSWORD_HINT,
            tone: form.password.length > 0 && !isValid.password ? "error" : "hint",
          }}
        />
        <FormField
          id="signup-password-confirm"
          label="비밀번호 확인"
          type="password"
          autoComplete="new-password"
          placeholder="다시 입력"
          value={form.passwordConfirm}
          onChange={(event) => handleChange("passwordConfirm", event.target.value)}
          message={
            form.passwordConfirm.length > 0 && !isValid.passwordConfirm
              ? { text: "비밀번호가 일치하지 않아요.", tone: "error" }
              : null
          }
        />
        <button type="submit" disabled={!canSubmit || isSubmitting} className={primaryButtonClass}>
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>
        {result && (
          <p
            role={result.tone === "error" ? "alert" : "status"}
            className={result.tone === "error" ? "text-center text-sm text-red-600" : "text-center text-sm text-[#235ce8]"}
          >
            {result.text}
          </p>
        )}
        <p className="text-center text-[13px] text-[#6a7081]">
          이미 계정이 있나요?{" "}
          <Link to="/login" className="font-bold text-[#235ce8]">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
