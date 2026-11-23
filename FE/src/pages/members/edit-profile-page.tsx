import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMeQuery } from "../../hooks/use-member-queries";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { apiErrorMessage } from "../../utils/api-error-message";

export function EditProfilePage() {
  const me = useMeQuery();
  if (me.isLoading) return <p role="status" className="p-10">내 정보를 불러오는 중이에요.</p>;
  if (me.isError) return <p role="alert" className="p-10">{apiErrorMessage(me.error)}</p>;
  return me.data ? <EditProfileForm email={me.data.email} nickname={me.data.nickname} /> : null;
}

function EditProfileForm({ email, nickname: initialNickname }: { email: string; nickname: string }) {
  const [nickname, setNickname] = useState(initialNickname);
  const mutation = useUpdateMeMutation();
  const navigate = useNavigate();
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  return <main className="mx-auto max-w-lg px-6 py-14">
    <h1 className="mb-8 text-3xl font-bold">내 정보 수정</h1>
    <form className="space-y-6" onSubmit={event => {
      event.preventDefault();
      if (!valid || mutation.isPending) return;
      mutation.mutate({ nickname: nickname.trim() }, { onSuccess: () => { void navigate({ to: "/me" }); } });
    }}>
      <div><label htmlFor="profile-email" className="mb-2 block">이메일</label>
        <input id="profile-email" value={email} readOnly className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3 text-gray-400" /></div>
      <div><label htmlFor="profile-nickname" className="mb-2 block">닉네임</label>
        <input id="profile-nickname" value={nickname} onChange={event => setNickname(event.target.value)} disabled={mutation.isPending}
          required minLength={2} maxLength={12} className="w-full rounded-lg border border-gray-600 bg-[#202229] px-4 py-3" /></div>
      <button disabled={!valid || mutation.isPending} className="w-full rounded-lg bg-red-600 py-3 font-bold disabled:opacity-40">{mutation.isPending ? "저장 중" : "저장"}</button>
      <Link to="/me" className="block text-center underline">취소</Link>
      {mutation.isError && <p role="alert" className="text-red-400">{apiErrorMessage(mutation.error)}</p>}
    </form>
  </main>;
}
