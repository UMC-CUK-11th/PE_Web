import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuthCard, AuthField } from "../../components/auth/auth-ui";

// 7주차는 퍼블리싱 범위다. 로그인 API와 토큰 저장은 8주차에 연결한다.
export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return <AuthCard title="로그인" description="좋아하는 영화와 기록을 다시 만나보세요.">
    <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
      <AuthField id="login-email" label="이메일" type="email" autoComplete="email" placeholder="example@email.com"
        value={email} onChange={(event) => setEmail(event.target.value)} />
      <AuthField id="login-password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요"
        value={password} onChange={(event) => setPassword(event.target.value)} />
      <button type="submit" disabled={!email.trim() || !password}
        className="w-full rounded-lg bg-[#536be8] py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500">로그인</button>
    </form>
    <p className="mt-6 text-center text-sm text-gray-500">아직 계정이 없으신가요? <Link to="/signup" className="ml-1 font-semibold text-[#536be8]">회원가입</Link></p>
  </AuthCard>;
}
