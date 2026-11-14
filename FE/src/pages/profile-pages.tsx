import { useState, type SubmitEvent } from "react";
import { Link } from "@tanstack/react-router";
import { buttonClass, inputClass, linkClass, MemberForm } from "../components/member-form";
import { useMeQuery } from "../hooks/use-me-query";
import { useUpdateMeMutation } from "../hooks/use-update-me-mutation";
import { nicknameError } from "../utils/member-validation";

// 내 정보 조회 결과에 따라 로딩/실패 화면을 공통으로 보여 줌
function useMeOrStatus() {
  const meQuery = useMeQuery();
  if (meQuery.isPending) return { me: null, status: <p className="text-sm text-gray-500">내 정보를 불러오는 중이에요.</p> };
  if (meQuery.isError) return { me: null, status: <p role="alert" className="text-sm text-red-600">내 정보를 불러오지 못했어요. 다시 로그인해 주세요.</p> };
  return { me: meQuery.data, status: null };
}

export function ProfilePage() {
  const { me, status } = useMeOrStatus();
  return <MemberForm title="내 정보">
    {status ?? (me && <>
      <dl className="space-y-5">
        <div><dt className="text-sm text-gray-500">닉네임</dt><dd className="mt-1 break-all font-semibold">{me.nickname}</dd></div>
        <div><dt className="text-sm text-gray-500">이메일</dt><dd className="mt-1 break-all font-semibold">{me.email}</dd></div>
      </dl>
      <Link to="/my/edit" className={`${buttonClass} mt-6 inline-block no-underline`}>내 정보 수정</Link>
    </>)}
  </MemberForm>;
}

export function ProfileEditPage() {
  const { me, status } = useMeOrStatus();
  return <MemberForm title="내 정보 수정">
    {status ?? (me && <ProfileEditForm initialNickname={me.nickname} email={me.email} />)}
  </MemberForm>;
}

// 내 정보를 받아 온 뒤에 폼을 그려야 입력창의 처음 값을 서버 닉네임으로 채울 수 있음
function ProfileEditForm({ initialNickname, email }: { initialNickname: string; email: string }) {
  const [nickname, setNickname] = useState(initialNickname);
  const updateMeMutation = useUpdateMeMutation();
  const error = nicknameError(nickname);
  const canSubmit = !error && !updateMeMutation.isPending;

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    updateMeMutation.mutate({ nickname: nickname.trim() });
  }

  return <form onSubmit={submit} className="space-y-5" noValidate>
    <div>
      <label htmlFor="profile-nickname" className="mb-2 block text-sm font-semibold">닉네임</label>
      <input id="profile-nickname" className={inputClass} value={nickname} autoComplete="nickname" required
        aria-invalid={Boolean(error)} aria-describedby="profile-nickname-error" onChange={event => setNickname(event.target.value)} />
      <p id="profile-nickname-error" aria-live="polite" className="mt-1 text-sm text-red-600">{error}</p>
    </div>
    <p className="break-all text-sm text-gray-600">이메일: {email}</p>
    <div className="flex items-center gap-4">
      <button type="submit" className={buttonClass} disabled={!canSubmit}>
        {updateMeMutation.isPending ? "저장 중" : "저장"}
      </button>
      <Link to="/my" className={linkClass}>취소</Link>
    </div>
  </form>;
}
