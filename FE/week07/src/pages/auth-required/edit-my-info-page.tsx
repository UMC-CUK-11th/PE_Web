import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { readProfilePreview, saveProfilePreview } from "./profile-preview";

export function EditMyInfoPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(readProfilePreview);
  const canSave = profile.nickname.trim().length >= 2 && profile.nickname.trim().length <= 12;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSave) return;
    saveProfilePreview({ ...profile, nickname: profile.nickname.trim(), introduction: profile.introduction.trim() });
    void navigate({ to: "/my-info" });
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-76px)] w-full max-w-[680px] px-5 py-16">
      <h1 className="mb-2 text-[32px] font-bold">내 정보 수정</h1>
      <p className="mb-8 text-sm text-[#7b808b]">닉네임과 소개를 바꿔 보세요.</p>
      <form className="space-y-5 rounded-xl border border-[#e4e7ed] bg-white p-7" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="profile-email">이메일</label>
          <input className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-[#f6f7f9] px-4 text-sm text-[#7b808b]" id="profile-email" type="email" value={profile.email} readOnly />
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
          <input className="h-12 w-full rounded-lg border border-[#dfe3ea] px-4 text-sm outline-none focus:border-[#3678ff]" id="profile-nickname" type="text" value={profile.nickname} onChange={(event) => setProfile((prev) => ({ ...prev, nickname: event.target.value }))} maxLength={12} aria-invalid={!canSave} />
          {!canSave && <p className="mt-2 text-xs text-[#f04438]">닉네임은 2~12자로 입력해 주세요.</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="profile-introduction">한 줄 소개</label>
          <textarea className="min-h-28 w-full rounded-lg border border-[#dfe3ea] p-4 text-sm outline-none focus:border-[#3678ff]" id="profile-introduction" value={profile.introduction} onChange={(event) => setProfile((prev) => ({ ...prev, introduction: event.target.value }))} maxLength={200} />
        </div>
        <div className="flex justify-end gap-3">
          <Link className="rounded-lg border border-[#dfe3ea] px-5 py-3 text-sm font-bold text-[#4d5563] no-underline" to="/my-info">취소</Link>
          <button className="rounded-lg bg-[#2669ee] px-5 py-3 text-sm font-bold text-white disabled:bg-[#9bb5f2]" type="submit" disabled={!canSave}>저장하기</button>
        </div>
      </form>
      <p className="mt-4 text-xs text-[#7b808b]">변경 내용은 이 브라우저에만 저장돼요. 서버 수정 API는 8주차에 연결해요.</p>
    </main>
  );
}
