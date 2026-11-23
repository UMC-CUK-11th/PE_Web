import { useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { getMe } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { useAuthStore } from "../../stores/auth-store";

export function EditMyInfoPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const updateMeMutation = useUpdateMeMutation();
  const [nicknameInput, setNicknameInput] = useState<string | null>(null);
  const nickname = nicknameInput ?? meQuery.data?.nickname ?? "";
  const trimmedNickname = nickname.trim();
  const canSubmit = trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || updateMeMutation.isPending) return;

    updateMeMutation.mutate(
      { nickname: trimmedNickname },
      { onSuccess: () => void navigate({ to: "/my-info" }) },
    );
  };

  return (
    <main className="mx-auto min-h-[calc(100vh-76px)] w-full max-w-[680px] px-5 py-16">
      <h1 className="mb-2 text-[32px] font-bold">내 정보 수정</h1>
      <p className="mb-8 text-sm text-[#7b808b]">닉네임을 바꿔 보세요.</p>
      {!accessToken ? (
        <p className="rounded-xl border border-[#e4e7ed] bg-white p-7">
          내 정보를 수정하려면 <Link to="/login">로그인</Link>해 주세요.
        </p>
      ) : meQuery.isPending ? (
        <p className="rounded-xl border border-[#e4e7ed] bg-white p-7" role="status">내 정보를 불러오는 중이에요.</p>
      ) : meQuery.isError ? (
        <p className="rounded-xl border border-[#e4e7ed] bg-white p-7" role="alert">내 정보를 불러오지 못했어요.</p>
      ) : (
        <form className="space-y-5 rounded-xl border border-[#e4e7ed] bg-white p-7" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="profile-email">이메일</label>
            <input className="h-12 w-full rounded-lg border border-[#dfe3ea] bg-[#f6f7f9] px-4 text-sm text-[#7b808b]" id="profile-email" type="email" value={meQuery.data.email} readOnly />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
            <input className="h-12 w-full rounded-lg border border-[#dfe3ea] px-4 text-sm outline-none focus:border-[#3678ff]" id="profile-nickname" type="text" value={nickname} onChange={(event) => setNicknameInput(event.target.value)} maxLength={12} aria-invalid={!canSubmit} />
            {!canSubmit && <p className="mt-2 text-xs text-[#f04438]">닉네임은 2~12자로 입력해 주세요.</p>}
          </div>
          <div className="flex justify-end gap-3">
            <Link className="rounded-lg border border-[#dfe3ea] px-5 py-3 text-sm font-bold text-[#4d5563] no-underline" to="/my-info">취소</Link>
            <button className="rounded-lg bg-[#2669ee] px-5 py-3 text-sm font-bold text-white disabled:bg-[#9bb5f2]" type="submit" disabled={!canSubmit || updateMeMutation.isPending}>
              {updateMeMutation.isPending ? "저장 중" : "저장"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
