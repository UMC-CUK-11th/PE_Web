"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { meOptions } from "../../api/private-query-options";
import { memberErrorMessage } from "../../api/api-client";
import { inputStyle, primaryButtonStyle } from "../../components/auth/form-styles";
import { validNickname } from "../auth/signup-validation";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import type { MemberInfo } from "../../api/members/me";
export function EditProfilePage() {
  const me = useQuery(meOptions());
  return me.data ? <EditForm profile={me.data} /> : null;
}
function EditForm({ profile }: { profile: MemberInfo }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const lock = useRef(false);
  const mutation = useUpdateMeMutation(() => { lock.current = false; });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validNickname(nickname) || mutation.isPending || lock.current || nickname.trim() === profile.nickname) return;
    lock.current = true;
    mutation.mutate({ nickname: nickname.trim() });
  }
  return <main className="mx-auto min-h-[70vh] max-w-2xl px-4 py-10 md:px-8"><h1 className="text-3xl font-extrabold">내 정보 수정</h1><p className="mt-3 text-sm text-slate-500">나를 표현할 닉네임을 바꿔 보세요.</p>
    <form className="mt-6 space-y-6 rounded-3xl border border-slate-200 bg-white p-6" noValidate onSubmit={submit}>
      <div><label htmlFor="profile-email" className="mb-2 block text-sm font-bold">이메일</label><input id="profile-email" className={inputStyle} value={profile.email} readOnly /></div>
      <div><label htmlFor="profile-nickname" className="mb-2 block text-sm font-bold">닉네임</label><input id="profile-nickname" className={inputStyle} value={nickname} disabled={mutation.isPending} aria-invalid={!validNickname(nickname)} aria-describedby="nickname-help" onChange={(event) => { setNickname(event.target.value); mutation.reset(); }} /><p id="nickname-help" className="mt-2 text-xs text-slate-500">닉네임은 2~12자로 입력해 주세요.</p></div>
      {mutation.isError && <p role="alert" className="text-sm text-red-600">{memberErrorMessage(mutation.error)}</p>}
      {mutation.isSuccess && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">내 정보를 수정했어요. <Link href="/mypage" className="font-bold underline">변경된 내 정보 보기</Link></p>}
      <div className="flex gap-3"><Link href="/mypage" className="rounded-xl border border-slate-200 px-5 py-3 text-sm">취소</Link><button className={primaryButtonStyle} disabled={!validNickname(nickname) || nickname.trim() === profile.nickname || mutation.isPending}>{mutation.isPending ? "저장 중…" : "변경 내용 저장"}</button></div>
    </form>
  </main>;
}
