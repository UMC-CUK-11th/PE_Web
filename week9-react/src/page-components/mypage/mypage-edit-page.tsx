"use client";

import { useRef, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { checkNickname } from "../../api/member";
import { useAuthStore } from "../../stores/auth-store";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function MyPageEdit() {
  const router = useRouter();

  const accessToken = useAuthStore((state) => state.accessToken);

  // 서버에서 회원 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 회원 정보 수정 Mutation
  const updateMutation = useUpdateMeMutation();

  // 사용자가 직접 수정한 닉네임만 별도 관리
  const [editedNickname, setEditedNickname] = useState<string | null>(null);

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  // 오래된 중복 확인 응답을 무시하기 위한 요청 번호
  const checkRequestId = useRef(0);

  // 서버에서 가져온 회원 정보
  const email = meQuery.data?.email ?? "";
  const originalNickname = meQuery.data?.nickname ?? "";

  // 직접 입력한 값이 없으면 서버의 닉네임 사용
  const newNickname = editedNickname ?? originalNickname;
  const trimmedNickname = newNickname.trim();

  // 닉네임 유효성 검사
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  // 기존 닉네임과 변경 여부 비교
  const isNicknameChanged = trimmedNickname !== originalNickname;

  // 현재 입력값의 중복 확인 완료 여부
  const isNicknameChecked = checkedNickname === trimmedNickname;

  // 저장 가능 여부
  const canSubmit =
    Boolean(accessToken) &&
    meQuery.isSuccess &&
    isNicknameValid &&
    isNicknameChanged &&
    isNicknameChecked &&
    !isCheckingNickname &&
    !updateMutation.isPending;

  // 닉네임 입력 변경
  const handleNicknameChange = (value: string) => {
    setEditedNickname(value);
    setNicknameMessage("");
    setCheckedNickname(null);

    // 이전 중복 확인 요청 무효화
    checkRequestId.current += 1;
    setIsCheckingNickname(false);
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!isNicknameValid) {
      setNicknameMessage("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    if (!isNicknameChanged) {
      setNicknameMessage("현재 사용 중인 닉네임입니다.");
      return;
    }

    const nicknameToCheck = trimmedNickname;
    const requestId = ++checkRequestId.current;

    setIsCheckingNickname(true);
    setCheckedNickname(null);
    setNicknameMessage("");

    try {
      const available = await checkNickname(nicknameToCheck);

      // 요청 이후 입력값이 바뀌었다면 이전 응답 무시
      if (requestId !== checkRequestId.current) {
        return;
      }

      if (available) {
        setCheckedNickname(nicknameToCheck);
        setNicknameMessage("사용 가능한 닉네임입니다.");
      } else {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
      }
    } catch {
      if (requestId !== checkRequestId.current) {
        return;
      }

      setNicknameMessage("닉네임 중복 확인에 실패했습니다.");
    } finally {
      if (requestId === checkRequestId.current) {
        setIsCheckingNickname(false);
      }
    }
  };

  // 회원 정보 수정
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    updateMutation.mutate(
      {
        nickname: trimmedNickname,
      },
      {
        onSuccess: () => {
          router.push("/mypage");
        },
      },
    );
  };

  return (
    <main className="min-h-[calc(100vh-60px)] bg-gray-100 px-5 py-6">
      <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px]">
        {/* 상단 제목 및 저장 버튼 */}
        <div className="mb-12 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">내 정보 수정</h1>

            <p className="mt-3 text-xs text-gray-400">
              닉네임과 프로필 이미지만 변경할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="shrink-0 rounded-md bg-blue-600 px-5 py-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {updateMutation.isPending ? "저장 중..." : "변경사항 저장"}
          </button>
        </div>

        <div className="grid gap-10 md:grid-cols-[190px_minmax(0,1fr)]">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center pt-4">
            <div className="relative">
              <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gray-200">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="text-black"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" />
                </svg>
              </div>

              <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 16 1-4 6-6 3 3-6 6-4 1Z" />
                </svg>
              </span>
            </div>

            <p className="mt-4 text-xs font-semibold text-gray-900">
              프로필 이미지
            </p>

            <p className="mt-2 text-[11px] text-gray-400">JPG·PNG, 최대 5MB</p>
          </div>

          {/* 사용자 정보 */}
          <div className="space-y-6">
            {/* 닉네임 */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-800">
                닉네임
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => {
                    handleNicknameChange(e.target.value);
                  }}
                  disabled={!meQuery.isSuccess}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 pr-20 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                  required
                />

                <button
                  type="button"
                  onClick={() => void handleNicknameCheck()}
                  disabled={
                    !meQuery.isSuccess ||
                    isCheckingNickname ||
                    !isNicknameValid ||
                    !isNicknameChanged
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-blue-600 disabled:text-gray-400"
                >
                  {isCheckingNickname ? "확인 중..." : "중복 확인"}
                </button>
              </div>

              {/* 닉네임 중복 확인 결과 */}
              {nicknameMessage && (
                <p className="mt-2 text-xs text-gray-500">{nicknameMessage}</p>
              )}

              {/* 닉네임 유효성 검사 메시지 */}
              {newNickname && !isNicknameValid && (
                <p className="mt-2 text-xs text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-800">
                이메일
              </label>

              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            {/* 안내 문구 */}
            <p className="pt-3 text-[11px] text-gray-400">
              변경사항은 서버에 저장되며, 수정 후 마이페이지에 즉시 반영됩니다.
            </p>

            {/* 회원 정보 로딩 */}
            {meQuery.isPending && accessToken && (
              <p className="text-xs text-gray-500">
                회원 정보를 불러오는 중입니다.
              </p>
            )}

            {/* 회원 정보 조회 실패 */}
            {meQuery.isError && (
              <p className="text-xs text-red-500">
                회원 정보를 불러오지 못했습니다.
              </p>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}


