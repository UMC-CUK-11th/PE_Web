import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { loginMutationOptions } from "../../api/auth-mutation-options";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/api-error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const loginMutation = useMutation({
    ...loginMutationOptions(),
    onSuccess: (session) => {
      setSession(session);
      void navigate({ to: "/my" });
    },
    onError: async (error) => {
      setErrorMessage(await getApiErrorMessage(error, "로그인에 실패했어요. 입력 정보를 확인해 주세요."));
    },
  });

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const isPasswordValid = password.length >= 8;
  const canSubmit = isEmailValid && isPasswordValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setErrorMessage("");
    loginMutation.mutate({ email: email.trim(), password });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-[440px] rounded-2xl border border-[#e2e6eb] bg-white px-10 py-11 shadow-[0_18px_45px_rgba(26,35,50,0.08)] max-sm:px-6">
        <div className="text-center">
          <img className="mx-auto size-12" src="/icons/movie.svg" alt="" />
          <h1 className="mt-5 text-[30px] font-extrabold tracking-[-1.3px]">UMCine 로그인</h1>
          <p className="mt-2 text-sm text-[#7b838e]">좋아하는 영화를 저장하고 감상을 남겨보세요.</p>
        </div>

        <form className="mt-9" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-bold" htmlFor="login-email">이메일</label>
          <div className="mt-2 flex h-12 items-center rounded-lg border border-[#dce1e7] bg-white px-4 focus-within:border-[#2877eb] focus-within:ring-1 focus-within:ring-[#2877eb]">
            <img className="mr-3 size-[18px] opacity-60" src="/icons/mail.svg" alt="" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a2a8b0]"
              id="login-email"
              type="email"
              value={email}
              placeholder="example@email.com"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {email.length > 0 && !isEmailValid && <p className="mt-2 text-xs text-[#e5484d]">올바른 이메일을 입력해 주세요.</p>}

          <div className="mt-5 flex items-center justify-between">
            <label className="text-sm font-bold" htmlFor="login-password">비밀번호</label>
            <button className="cursor-pointer border-0 bg-transparent text-xs font-semibold text-[#2877eb]" type="button">비밀번호 찾기</button>
          </div>
          <div className="mt-2 flex h-12 items-center rounded-lg border border-[#dce1e7] bg-white px-4 focus-within:border-[#2877eb] focus-within:ring-1 focus-within:ring-[#2877eb]">
            <img className="mr-3 size-[18px] opacity-60" src="/icons/lock.svg" alt="" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a2a8b0]"
              id="login-password"
              type="password"
              value={password}
              placeholder="8자 이상 입력해 주세요."
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {password.length > 0 && !isPasswordValid && <p className="mt-2 text-xs text-[#e5484d]">비밀번호를 8자 이상 입력해 주세요.</p>}

          {errorMessage && <p className="mt-5 rounded-lg bg-[#fff0f0] px-4 py-3 text-xs text-[#d33f49]" role="alert">{errorMessage}</p>}

          <button
            className="mt-7 h-12 w-full cursor-pointer rounded-lg border-0 bg-[#2877eb] text-sm font-bold text-white transition-colors hover:bg-[#1768d7] disabled:cursor-not-allowed disabled:bg-[#c9d2df]"
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-[#9299a2]">회원 계정으로 로그인하면 즐겨찾기와 평점을 관리할 수 있어요.</p>
      </section>
    </main>
  );
}
