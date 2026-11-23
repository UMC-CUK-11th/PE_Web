import { Link } from "@tanstack/react-router";
import { useMeQuery } from "../../hooks/use-member-queries";
import { apiErrorMessage } from "../../utils/api-error-message";

export function ProfilePage() {
  const me = useMeQuery();
  return <main className="mx-auto max-w-lg px-6 py-14">
    <h1 className="mb-8 text-3xl font-bold">내 정보</h1>
    {me.isLoading ? <p role="status">내 정보를 불러오는 중이에요.</p>
      : me.isError ? <p role="alert">{apiErrorMessage(me.error)}</p>
      : me.data && <>
        <dl className="space-y-6 rounded-xl bg-[#202229] p-6">
          <div><dt className="text-gray-400">이메일</dt><dd className="mt-2">{me.data.email}</dd></div>
          <div><dt className="text-gray-400">닉네임</dt><dd className="mt-2">{me.data.nickname}</dd></div>
          <div><dt className="text-gray-400">가입일</dt><dd className="mt-2">{me.data.createdAt.slice(0, 10)}</dd></div>
        </dl>
        <Link to="/edit-profile" className="mt-6 block rounded-lg bg-red-600 py-3 text-center font-bold">내 정보 수정</Link>
      </>}
  </main>;
}
