import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("로그인 API는 8주차에 연결해요. 지금은 입력 화면만 확인할 수 있어요.");
  };

  return (
    <main className="flex min-h-[calc(100vh-76px)] items-center justify-center px-5 py-16">
      <div className="w-full max-w-[440px]">
        <h1 className="mb-2 text-[32px] font-bold">로그인</h1>
        <p className="mb-8 text-sm text-[#7b808b]">UMCine에 오신 것을 환영해요.</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="login-email">이메일</label>
            <input className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none focus:border-[#3678ff]" id="login-email" type="email" autoComplete="email" placeholder="이메일을 입력해 주세요" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="login-password">비밀번호</label>
            <input className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-white px-4 text-sm outline-none focus:border-[#3678ff]" id="login-password" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          <button className="h-12 w-full rounded-lg bg-[#2669ee] text-sm font-bold text-white disabled:bg-[#9bb5f2]" type="submit" disabled={!email || !password}>로그인</button>
        </form>
        {notice && <p className="mt-4 rounded-lg bg-white p-4 text-sm text-[#4d5563]" role="status">{notice}</p>}
        <p className="mt-6 text-center text-xs text-[#a4aab5]">아직 계정이 없나요? <Link className="font-bold text-[#2669ee]" to="/signup">회원가입</Link></p>
      </div>
    </main>
  );
}
