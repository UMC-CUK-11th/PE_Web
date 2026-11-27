"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import type { MemberInfo } from "../../api/member-api";
import { memberQueryKeys, myInfoQueryOptions, updateMyInfoMutationOptions } from "../../api/member-query-options";
import { ErrorState, LoadingState } from "../../components/request-state";
import { getApiErrorMessage } from "../../utils/api-error";

interface MemberProfileEditFormProps {
  member: MemberInfo;
}

function MemberProfileEditForm({ member }: MemberProfileEditFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(member.nickname);
  const [errorMessage, setErrorMessage] = useState("");
  const updateMutation = useMutation({
    ...updateMyInfoMutationOptions(),
    onSuccess: (updatedMember) => {
      queryClient.setQueryData<MemberInfo>(memberQueryKeys.me(), updatedMember);
      router.push("/my");
    },
    onError: async (error) => {
      setErrorMessage(await getApiErrorMessage(error, "회원 정보 수정에 실패했어요."));
    },
  });
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isNicknameValid || updateMutation.isPending) return;
    setErrorMessage("");
    updateMutation.mutate(nickname.trim());
  };

  return (
    <main className="flex-1">
      <div className="mx-auto w-[min(calc(100%-48px),700px)] py-12 pb-24 max-[420px]:w-[calc(100%-32px)]">
        <p className="text-sm font-bold text-[#2877eb]">MY PAGE</p>
        <h1 className="mt-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보 수정</h1>
        <p className="mt-2 text-sm text-[#7c848f]">변경할 닉네임을 입력하고 저장해 주세요.</p>

        <form className="mt-8 rounded-2xl border border-[#e0e4e9] bg-white p-9 shadow-[0_15px_40px_rgba(28,38,54,0.06)] max-sm:p-6" onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-bold" htmlFor="profile-email">이메일</label>
          <input className="mt-2 h-12 w-full cursor-not-allowed rounded-lg border border-[#e5e8ec] bg-[#f5f6f8] px-4 text-sm text-[#7c848f]" id="profile-email" type="email" value={member.email} readOnly />

          <label className="mt-6 block text-sm font-bold" htmlFor="profile-nickname">닉네임</label>
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#dce1e7] px-4 text-sm outline-none focus:border-[#2877eb] focus:ring-1 focus:ring-[#2877eb]"
            id="profile-nickname"
            type="text"
            value={nickname}
            maxLength={12}
            disabled={updateMutation.isPending}
            onChange={(event) => setNickname(event.target.value)}
          />
          <div className="mt-2 flex justify-between gap-3 text-xs">
            <span className={isNicknameValid ? "text-[#77808b]" : "text-[#e5484d]"}>2자 이상 12자 이하로 입력해 주세요.</span>
            <span className="text-[#9299a2]">{nickname.length}/12</span>
          </div>

          {errorMessage && <p className="mt-5 rounded-lg bg-[#fff0f0] px-4 py-3 text-xs text-[#d33f49]" role="alert">{errorMessage}</p>}

          <div className="mt-8 flex justify-end gap-3">
            <Link className="inline-flex h-11 items-center rounded-lg border border-[#dce1e7] px-5 text-sm font-bold text-[#525a64] no-underline" href="/my">취소</Link>
            <button className="h-11 cursor-pointer rounded-lg border-0 bg-[#2877eb] px-6 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-[#c9d2df]" type="submit" disabled={!isNicknameValid || updateMutation.isPending}>
              {updateMutation.isPending ? "저장 중" : "저장하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export function MemberProfileEditPage() {
  const memberQuery = useQuery(myInfoQueryOptions());

  if (memberQuery.isPending) return <main className="flex-1"><LoadingState message="회원 정보를 불러오는 중이에요." /></main>;
  if (memberQuery.isError) return <main className="flex-1"><ErrorState error={memberQuery.error} onRetry={() => void memberQuery.refetch()} /></main>;

  return <MemberProfileEditForm key={memberQuery.data.nickname} member={memberQuery.data} />;
}
