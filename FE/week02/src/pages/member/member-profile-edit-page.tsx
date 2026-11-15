import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMemberProfileStore, type MemberProfile } from "../../stores/member-profile-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MemberProfileEditPage() {
  const navigate = useNavigate();
  const profile = useMemberProfileStore((state) => state.profile);
  const updateProfile = useMemberProfileStore((state) => state.updateProfile);
  const [form, setForm] = useState<MemberProfile>(profile);

  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const canSubmit = isEmailValid && isNicknameValid;

  const handleChange = (key: keyof MemberProfile, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    updateProfile({
      email: form.email.trim(),
      nickname: form.nickname.trim(),
      introduction: form.introduction.trim(),
    });
    navigate("/my");
  };

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),700px)] py-12 pb-24 max-[420px]:w-[calc(100%-32px)]">
        <p className="text-sm font-bold text-[#2877eb]">MY PAGE</p>
        <h1 className="mt-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보 수정</h1>
        <p className="mt-2 text-sm text-[#7c848f]">변경할 정보를 입력하고 저장해 주세요.</p>

        <form className="mt-8 rounded-2xl border border-[#e0e4e9] bg-white p-9 shadow-[0_15px_40px_rgba(28,38,54,0.06)] max-sm:p-6" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-bold" htmlFor="profile-email">이메일</label>
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#dce1e7] px-4 text-sm outline-none focus:border-[#2877eb] focus:ring-1 focus:ring-[#2877eb]"
            id="profile-email"
            type="email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
          />
          {!isEmailValid && form.email.length > 0 && <p className="mt-2 text-xs text-[#e5484d]">올바른 이메일을 입력해 주세요.</p>}

          <label className="mt-6 block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#dce1e7] px-4 text-sm outline-none focus:border-[#2877eb] focus:ring-1 focus:ring-[#2877eb]"
            id="profile-nickname"
            type="text"
            value={form.nickname}
            maxLength={12}
            onChange={(event) => handleChange("nickname", event.target.value)}
          />
          <div className="mt-2 flex justify-between gap-3 text-xs">
            <span className={isNicknameValid ? "text-[#77808b]" : "text-[#e5484d]"}>2자 이상 12자 이하로 입력해 주세요.</span>
            <span className="text-[#9299a2]">{form.nickname.length}/12</span>
          </div>

          <label className="mt-6 block text-sm font-bold" htmlFor="profile-introduction">한 줄 소개</label>
          <textarea
            className="mt-2 h-28 w-full resize-none rounded-lg border border-[#dce1e7] px-4 py-3 text-sm leading-6 outline-none focus:border-[#2877eb] focus:ring-1 focus:ring-[#2877eb]"
            id="profile-introduction"
            value={form.introduction}
            maxLength={80}
            placeholder="나를 소개하는 문장을 입력해 주세요."
            onChange={(event) => handleChange("introduction", event.target.value)}
          />
          <p className="mt-1 text-right text-xs text-[#9299a2]">{form.introduction.length}/80</p>

          <div className="mt-8 flex justify-end gap-3">
            <Link className="inline-flex h-11 items-center rounded-lg border border-[#dce1e7] px-5 text-sm font-bold text-[#525a64] no-underline" to="/my">취소</Link>
            <button className="h-11 cursor-pointer rounded-lg border-0 bg-[#2877eb] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#c9d2df]" type="submit" disabled={!canSubmit}>저장하기</button>
          </div>
        </form>
      </div>
    </main>
  );
}
