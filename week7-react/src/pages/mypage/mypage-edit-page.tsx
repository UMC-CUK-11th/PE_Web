import { useState, type SubmitEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useUserStore } from "../../stores/user-store";

export function MyPageEdit() {
  const navigate = useNavigate();
  const { nickname, email, updateUser } = useUserStore();

  const [newNickname, setNewNickname] = useState(nickname);
  const newEmail = email;
  const [nicknameMessage, setNicknameMessage] = useState("");

  const isNicknameValid =
    newNickname.trim().length >= 2 && newNickname.trim().length <= 12;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim());

  const handleNicknameCheck = () => {
    if (!isNicknameValid) {
      setNicknameMessage("닉네임은 2~12자로 입력해 주세요.");
      return;
    }

    setNicknameMessage(
      "입력 형식을 확인했어요. 실제 중복 확인은 API 연결이 필요합니다.",
    );
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isNicknameValid || !isEmailValid) return;

    updateUser(newNickname.trim(), newEmail.trim());
    alert("내 정보가 수정되었습니다.");
    void navigate({ to: "/mypage" });
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
            disabled={!isNicknameValid || !isEmailValid}
            className="shrink-0 rounded-md bg-blue-600 px-5 py-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            변경사항 저장
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
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-800">
                닉네임
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => {
                    setNewNickname(e.target.value);
                    setNicknameMessage("");
                  }}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 pr-20 text-sm outline-none focus:border-blue-500"
                  required
                />

                <button
                  type="button"
                  onClick={handleNicknameCheck}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-blue-600"
                >
                  중복 확인
                </button>
              </div>

              {nicknameMessage && (
                <p className="mt-2 text-xs text-gray-500">{nicknameMessage}</p>
              )}

              {newNickname && !isNicknameValid && (
                <p className="mt-2 text-xs text-red-500">
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-800">
                이메일
              </label>

              <input
                type="email"
                value={newEmail}
                readOnly
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none"
              />
            </div>

            <p className="pt-3 text-[11px] text-gray-400">
              변경사항은 이 브라우저의 메모리에만 반영됩니다. 새로고침하면 예시
              값으로 돌아옵니다.
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
