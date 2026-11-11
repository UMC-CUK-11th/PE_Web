import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, type LoginRequest } from "../../api/members/login";
import { getMyInfo } from "../../api/members/get-my-info";
import { useAuthStore } from "../../stores/auth-store";
import { useMemberPreviewStore } from "../../stores/member-preview-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import "./auth-pages.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const updateProfile = useMemberPreviewStore((state) => state.updateProfile);
  const loginMutation = useMutation({
    mutationFn: async (body: LoginRequest) => {
      const { result } = await login(body);
      const { result: member } = await getMyInfo(result.accessToken);
      if (!Number.isInteger(member.memberId) || member.memberId <= 0) {
        throw new Error("회원 번호를 확인하지 못했어요.");
      }
      return { accessToken: result.accessToken, ...member };
    },
    onSuccess: (session) => {
      queryClient.removeQueries({ queryKey: ["ratings"] });
      updateProfile({ email: session.email, nickname: session.nickname });
      setSession(session);
      navigate({ to: "/mypage" });
    },
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginMutation.isPending) return;
    loginMutation.mutate({ email: email.trim(), password });
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <h1 id="login-title" className="auth-title">로그인</h1>
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="auth-field">
            <label htmlFor="login-email">이메일</label>
            <div className="auth-input-wrap">
              <img className="auth-input-icon" src="/icons/movie-icons/mail.svg" alt="" aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="off"
                value={email}
                disabled={loginMutation.isPending}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="auth-input auth-input-with-icon"
                required
              />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">비밀번호</label>
            <div className="auth-input-wrap">
              <img className="auth-input-icon" src="/icons/movie-icons/lock.svg" alt="" aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                disabled={loginMutation.isPending}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호"
                className="auth-input auth-input-with-icon"
                required
              />
            </div>
          </div>
          {loginMutation.isError && <p className="auth-error" role="alert">{getApiErrorMessage(loginMutation.error, "로그인하지 못했어요. 서버 연결과 입력 내용을 확인해 주세요.")}</p>}
          <button className="auth-submit" type="submit" disabled={loginMutation.isPending}>{loginMutation.isPending ? "로그인 중" : "로그인"}</button>
        </form>
        <p className="auth-switch">처음이신가요? <Link to="/signup">회원가입</Link></p>
      </section>
    </main>
  );
}
