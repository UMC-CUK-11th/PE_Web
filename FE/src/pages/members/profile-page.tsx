import { useState } from "react";

// 이번 주차는 화면과 입력 상태만 구현한다. 서버 조회·수정은 8주차 범위다.
export function ProfilePage() {
  const [profile, setProfile] = useState({ email: "movie@umc.com", nickname: "영화광" });
  const [nickname, setNickname] = useState(profile.nickname);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  return <main className="mx-auto max-w-lg px-6 py-14">
    <h1 className="mb-8 text-3xl font-bold">{editing ? "내 정보 수정" : "내 정보"}</h1>
    <p className="mb-6 text-sm text-gray-400">미리보기용 회원 정보입니다.</p>
    {editing ? <form className="space-y-6" onSubmit={event => {
      event.preventDefault();
      if (nickname.trim().length < 2 || nickname.trim().length > 12) return;
      setProfile(previous => ({ ...previous, nickname: nickname.trim() }));
      setEditing(false); setMessage("화면에 수정한 닉네임을 반영했어요.");
    }}>
      <div><label htmlFor="profile-email" className="mb-2 block">이메일</label>
        <input id="profile-email" value={profile.email} readOnly className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3 text-gray-400" /></div>
      <div><label htmlFor="profile-nickname" className="mb-2 block">닉네임</label>
        <input id="profile-nickname" value={nickname} onChange={event => setNickname(event.target.value)} minLength={2} maxLength={12} required className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3" /></div>
      <div className="flex gap-3"><button type="submit" className="flex-1 rounded-lg bg-red-600 py-3 font-bold">저장</button>
        <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-lg bg-gray-700 py-3">취소</button></div>
    </form> : <>
      <dl className="space-y-6 rounded-xl bg-[#202229] p-6">
        <div><dt className="text-gray-400">이메일</dt><dd className="mt-2">{profile.email}</dd></div>
        <div><dt className="text-gray-400">닉네임</dt><dd className="mt-2">{profile.nickname}</dd></div>
      </dl>
      <button onClick={() => { setNickname(profile.nickname); setEditing(true); setMessage(""); }} className="mt-6 w-full rounded-lg bg-red-600 py-3 font-bold">내 정보 수정</button>
    </>}
    <p role="status" className="mt-4">{message}</p>
  </main>;
}
