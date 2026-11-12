import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { inputStyle, primaryButtonStyle } from "../../components/auth/form-styles";
import { validNickname } from "../auth/signup-validation";
import { useProfilePreviewStore } from "./model/profile-preview-store";

export function EditProfilePage() {
  const profile = useProfilePreviewStore();
  const [nickname, setNickname] = useState(profile.nickname);
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validNickname(nickname)) return;
    profile.setNickname(nickname.trim());
    setSaved(true);
  }
  return (
    <main className="mx-auto min-h-[calc(100vh-112px)] max-w-2xl px-4 py-12 md:px-8 md:py-16">
      <Link to="/mypage" className="text-sm font-semibold text-slate-500 hover:text-blue-600">← 내 정보</Link>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">내 정보 수정</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">나를 표현할 닉네임을 바꿔 보세요.</p>
      <p className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">화면 미리보기 · 변경 내용은 서버에 저장되지 않으며 새로고침하면 초기화돼요.</p>
      <form className="mt-6 space-y-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={submit} noValidate>
        <div><label htmlFor="profile-email" className="mb-2 block text-sm font-semibold">이메일</label>
          <input id="profile-email" className={inputStyle} type="email" value={profile.email} readOnly aria-describedby="profile-email-help" />
          <p id="profile-email-help" className="mt-2 text-xs text-slate-500">가입한 이메일은 변경할 수 없어요.</p>
        </div>
        <div><label htmlFor="profile-nickname" className="mb-2 block text-sm font-semibold">닉네임</label>
          <input id="profile-nickname" className={inputStyle} value={nickname} autoComplete="nickname"
            aria-invalid={!validNickname(nickname)} aria-describedby="profile-nickname-help"
            onChange={(event) => { setNickname(event.target.value); setSaved(false); }} />
          <p id="profile-nickname-help" className={`mt-2 text-xs ${validNickname(nickname) ? "text-slate-500" : "text-red-600"}`}>닉네임은 2~12자로 입력해 주세요.</p>
        </div>
        {saved && <div role="status" className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">미리보기 프로필을 수정했어요. <Link to="/mypage" className="font-bold underline underline-offset-4">변경된 내 정보 보기</Link></div>}
        <div className="flex items-center gap-3"><Link to="/mypage" className="shrink-0 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">취소</Link>
          <button className={primaryButtonStyle} type="submit" disabled={!validNickname(nickname) || nickname.trim() === profile.nickname}>변경 내용 저장</button>
        </div>
      </form>
    </main>
  );
}
