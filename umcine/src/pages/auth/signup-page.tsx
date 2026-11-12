import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import "./signup-page.css";
type SignupField = "email" | "nickname" | "password" | "passwordConfirm";
type DuplicateCheckKey = "email" | "nickname";
const DEFAULT_DUPLICATE_CHECK = { isChecking: false, isAvailable: false };
export function SignupPage() {
    const [values, setValues] = useState({
        email: "",
        nickname: "",
        password: "",
        passwordConfirm: "",
    });
    const [touched, setTouched] = useState<Record<SignupField, boolean>>({
        email: false,
        nickname: false,
        password: false,
        passwordConfirm: false,
    });
    const [notice, setNotice] = useState("");
    const [duplicateCheck, setDuplicateCheck] = useState({
        email: DEFAULT_DUPLICATE_CHECK,
        nickname: DEFAULT_DUPLICATE_CHECK,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const errors = {
        email: !values.email.trim()
            ? "이메일을 입력해주세요."
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ||
                values.email.length > 254
                ? "올바른 이메일 형식으로 입력해주세요."
                : "",
        nickname: !values.nickname.trim()
            ? "닉네임을 입력해주세요."
            : values.nickname.length < 2 || values.nickname.length > 12
                ? "닉네임은 2자 이상 12자 이하로 입력해주세요."
                : "",
        password: !values.password
            ? "비밀번호를 입력해주세요."
            : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(values.password)
                ? "대문자, 소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상 입력해주세요."
                : new TextEncoder().encode(values.password).length > 72
                    ? "비밀번호는 UTF-8 기준 72바이트 이하로 입력해주세요."
                    : "",
        passwordConfirm: !values.passwordConfirm
            ? "비밀번호를 다시 입력해주세요."
            : values.passwordConfirm !== values.password
                ? "비밀번호가 일치하지 않습니다."
                : "",
    };
    const isValid = Object.values(errors).every((error) => error === "");
    const canSubmit = isValid &&
        duplicateCheck.email.isAvailable &&
        duplicateCheck.nickname.isAvailable;
    function changeField(field: SignupField, value: string) {
        if (isSubmitting)
            return;
        if (field === "email" || field === "nickname") {
            if (duplicateCheck[field].isChecking)
                return;
            setDuplicateCheck((previous) => ({
                ...previous,
                [field]: DEFAULT_DUPLICATE_CHECK,
            }));
        }
        setValues((previous) => ({ ...previous, [field]: value }));
        setNotice("");
    }
    function touchField(field: SignupField) {
        setTouched((previous) => ({ ...previous, [field]: true }));
    }
    async function checkDuplicate(field: DuplicateCheckKey) {
        touchField(field);
        if (errors[field] || duplicateCheck[field].isChecking || isSubmitting)
            return;
        const label = field === "email" ? "이메일" : "닉네임";
        setDuplicateCheck((previous) => ({
            ...previous,
            [field]: { isChecking: true, isAvailable: false },
        }));
        try {
            const response = field === "email"
                ? await checkEmailDuplicate(values.email.trim())
                : await checkNicknameDuplicate(values.nickname.trim());
            const isAvailable = response.available;
            setDuplicateCheck((previous) => ({
                ...previous,
                [field]: { ...previous[field], isAvailable },
            }));
            alert(isAvailable
                ? `사용할 수 있는 ${label}이에요.`
                : `이미 사용 중인 ${label}이에요.`);
        }
        catch {
            setDuplicateCheck((previous) => ({
                ...previous,
                [field]: { ...previous[field], isAvailable: false },
            }));
            alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
        }
        finally {
            setDuplicateCheck((previous) => ({
                ...previous,
                [field]: { ...previous[field], isChecking: false },
            }));
        }
    }
    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setTouched({
            email: true,
            nickname: true,
            password: true,
            passwordConfirm: true,
        });
        if (!canSubmit || isSubmitting)
            return;
        setIsSubmitting(true);
        try {
            const response = await signup({
                email: values.email.trim(),
                nickname: values.nickname.trim(),
                password: values.password,
            });
            alert(response.message);
        }
        catch {
            alert("회원가입에 실패했어요. 다시 시도해 주세요.");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (<main className="signup-page">
      <section className="signup-panel" aria-labelledby="signup-title">
        <h1 id="signup-title">회원가입</h1>
        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {" "}
          
          <div className="signup-field">
            <label htmlFor="signup-email">이메일</label>
            <div className="signup-input-row">
              <input id="signup-email" name="email" type="email" autoComplete="email" disabled={duplicateCheck.email.isChecking || isSubmitting} placeholder="name@example.com" value={values.email} onChange={(event) => changeField("email", event.target.value)} onBlur={() => touchField("email")} aria-invalid={touched.email && Boolean(errors.email)} aria-describedby={touched.email && errors.email
            ? "signup-email-error"
            : undefined}/>
              <button type="button" aria-label="이메일 중복 확인" disabled={Boolean(errors.email) ||
            duplicateCheck.email.isChecking ||
            isSubmitting} onClick={() => checkDuplicate("email")}>
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            
            {touched.email && errors.email && (<p className="signup-error" id="signup-email-error">
                {errors.email}
              </p>)}
          </div>
          <div className="signup-field">
            <label htmlFor="signup-nickname">닉네임</label>
            <div className="signup-input-row">
              <input id="signup-nickname" name="nickname" autoComplete="nickname" disabled={duplicateCheck.nickname.isChecking || isSubmitting} placeholder="2–12자" value={values.nickname} onChange={(event) => changeField("nickname", event.target.value)} onBlur={() => touchField("nickname")} aria-invalid={touched.nickname && Boolean(errors.nickname)} aria-describedby={touched.nickname && errors.nickname
            ? "signup-nickname-error"
            : undefined}/>
              <button type="button" aria-label="닉네임 중복 확인" disabled={Boolean(errors.nickname) ||
            duplicateCheck.nickname.isChecking ||
            isSubmitting} onClick={() => checkDuplicate("nickname")}>
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>
            {touched.nickname && errors.nickname && (<p className="signup-error" id="signup-nickname-error">
                {errors.nickname}
              </p>)}
          </div>
          <div className="signup-field">
            <label htmlFor="signup-password">비밀번호</label>
            <div className="signup-input-row">
              <input id="signup-password" name="password" type="password" autoComplete="new-password" disabled={isSubmitting} placeholder="8자 이상" value={values.password} onChange={(event) => changeField("password", event.target.value)} onBlur={() => touchField("password")} aria-invalid={touched.password && Boolean(errors.password)} aria-describedby="signup-password-help signup-password-error"/>
            </div>
            <p className="signup-help" id="signup-password-help">
              영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해
              주세요
            </p>
            <p className="signup-error" id="signup-password-error">
              {touched.password ? errors.password : ""}
            </p>
          </div>
          <div className="signup-field">
            <label htmlFor="signup-password-confirm">비밀번호 확인</label>
            <div className="signup-input-row">
              <input id="signup-password-confirm" name="passwordConfirm" type="password" autoComplete="new-password" disabled={isSubmitting} placeholder="다시 입력" value={values.passwordConfirm} onChange={(event) => changeField("passwordConfirm", event.target.value)} onBlur={() => touchField("passwordConfirm")} aria-invalid={touched.passwordConfirm && Boolean(errors.passwordConfirm)} aria-describedby={touched.passwordConfirm && errors.passwordConfirm
            ? "signup-password-confirm-error"
            : undefined}/>
            </div>
            {touched.passwordConfirm && errors.passwordConfirm && (<p className="signup-error" id="signup-password-confirm-error">
                {errors.passwordConfirm}
              </p>)}
          </div>
          <button className="signup-submit" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>{" "}
          
          {notice && (<p className="signup-notice" role="status">
              {notice}
            </p>)}
        </form>
        <p className="signup-login">
          이미 계정이 있나요?{" "}
          <Link to="/login">
            로그인
          </Link>
        </p>
      </section>
    </main>);
}
