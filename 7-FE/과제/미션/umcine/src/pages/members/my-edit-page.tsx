import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { checkNickname } from "../../api/members/check-nickname";
import { FieldButton, FormField } from "../../components/form/form-field";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { useProfileStore } from "../../stores/profile-store";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
type NicknameStatus = "idle" | "checking" | "available" | "taken" | "failed";

export function MyEditPage() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const [imageUrl, setImageUrl] = useState(profile.imageUrl);
  const [imageError, setImageError] = useState<string | null>(null);
  const [status, setStatus] = useState<NicknameStatus>("idle");

  const trimmed = nickname.trim();
  const isNicknameValid = trimmed.length >= 2 && trimmed.length <= 12;
  const isNicknameChanged = trimmed !== profile.nickname;
  // 닉네임을 바꿨다면 중복 확인을 통과해야 저장할 수 있다
  const canSave =
    isNicknameValid &&
    (isNicknameChanged ? status === "available" : true) &&
    (isNicknameChanged || imageUrl !== profile.imageUrl);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("5MB 이하 이미지만 올릴 수 있어요.");
      return;
    }
    setImageError(null);
    // 저장하지 않은 미리보기 주소는 새 이미지로 바꿀 때 정리한다
    if (imageUrl?.startsWith("blob:") && imageUrl !== profile.imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
  }

  async function handleCheckNickname() {
    if (!isNicknameValid || status === "checking") return;
    setStatus("checking");
    try {
      const { available } = await checkNickname(trimmed);
      setStatus(available ? "available" : "taken");
    } catch {
      setStatus("failed");
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;
    // 서버 저장(PATCH /members/me)은 8주차에 연결한다
    updateProfile({ nickname: trimmed, imageUrl });
    navigate({ to: "/my" });
  }

  const nicknameMessage =
    nickname.length > 0 && !isNicknameValid
      ? { text: "닉네임은 2자 이상 12자 이하로 입력해 주세요.", tone: "error" as const }
      : status === "available"
        ? { text: "사용할 수 있는 닉네임이에요.", tone: "success" as const }
        : status === "taken"
          ? { text: "이미 사용 중인 닉네임이에요.", tone: "error" as const }
          : status === "failed"
            ? { text: "중복 확인에 실패했어요. 다시 시도해 주세요.", tone: "error" as const }
            : null;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-10">
      <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">내 정보 수정</h1>
            <p className="mt-2 text-[13px] text-[#6a7081]">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button
            type="submit"
            disabled={!canSave}
            className="rounded-md bg-[#235ce8] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#9db5f3]"
          >
            변경사항 저장
          </button>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="flex flex-col items-center gap-2 md:pt-6">
            <label className="relative cursor-pointer" aria-label="프로필 이미지 선택">
              <ProfileAvatar imageUrl={imageUrl} className="size-[86px]" />
              <img src="/icons/edit.svg" alt="" className="absolute right-0 bottom-0 size-6" />
              <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
            </label>
            <p className="text-sm font-bold">프로필 이미지</p>
            <p className="text-[11px] text-[#9a9fae]">선택 사항 · 최대 5MB</p>
            {imageError && (
              <p role="alert" className="text-xs text-red-600">
                {imageError}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-5">
            <FormField
              id="edit-nickname"
              label="닉네임"
              value={nickname}
              disabled={status === "checking"}
              onChange={(event) => {
                setNickname(event.target.value);
                setStatus("idle");
              }}
              message={nicknameMessage}
              action={
                <FieldButton
                  aria-label="닉네임 중복 확인"
                  disabled={!isNicknameValid || !isNicknameChanged || status === "checking"}
                  onClick={handleCheckNickname}
                >
                  {status === "checking" ? "확인 중" : "중복 확인"}
                </FieldButton>
              }
            />
            <FormField id="edit-email" label="이메일" value={profile.email} readOnly disabled />
          </div>
        </div>
        <section
          aria-labelledby="withdraw"
          className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-red-500 bg-[#f5e3e3] px-5 py-4 md:mt-auto"
        >
          <div>
            <h2 id="withdraw" className="text-sm font-bold text-red-600">
              회원 탈퇴
            </h2>
            <p className="mt-1 text-xs text-red-600">탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
          </div>
          {/* 탈퇴 API가 생기면 연결한다 */}
          <button type="button" disabled className="rounded-md border border-red-500 bg-white px-4 py-2.5 text-xs font-bold text-red-600 disabled:cursor-not-allowed">
            회원 탈퇴
          </button>
        </section>
      </form>
    </main>
  );
}
