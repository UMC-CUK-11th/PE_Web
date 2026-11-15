import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuthCard, AuthField } from "../../components/auth/auth-ui";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";

export function EditMyPage() {
  const profile = useProfilePreviewStore();
  const [nickname, setNickname] = useState(profile.nickname);
  const [saved, setSaved] = useState(false);
  const isValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  return <AuthCard title="내 정보 수정" description="예시 프로필의 닉네임을 변경해 볼 수 있어요.">
    <form onSubmit={(event) => {
      event.preventDefault();
      if (!isValid) return;
      profile.setNickname(nickname.trim());
      setSaved(true);
    }} className="space-y-5">
      <AuthField id="profile-email" label="이메일" type="email" value={profile.email} readOnly hint="이메일은 변경할 수 없어요." />
      <AuthField id="profile-nickname" label="닉네임" value={nickname} autoComplete="nickname"
        onChange={(event) => { setNickname(event.target.value); setSaved(false); }}
        error={nickname.length > 0 && !isValid ? "닉네임은 2~12자로 입력해 주세요." : undefined} hint="2~12자로 입력해 주세요." />
      {saved && <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-800">예시 프로필에 변경 내용을 반영했어요.</p>}
      <button type="submit" disabled={!isValid || saved} className="w-full rounded-lg bg-[#536be8] py-3 text-sm font-semibold text-white disabled:bg-gray-200 disabled:text-gray-500">저장하기</button>
      <Link to="/mypage" className="block text-center text-sm text-gray-500">내 정보로 돌아가기</Link>
    </form>
  </AuthCard>;
}
