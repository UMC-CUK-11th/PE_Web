"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "../../hooks/use-me-query";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";
import "./profile-page.css";

export function ProfileEditPage() {
  const me = useMeQuery();
  if (me.isLoading) return <main className="profile-page">내 정보를 불러오는 중이에요.</main>;
  if (!me.data) return <main className="profile-page">내 정보를 불러오지 못했어요.</main>;
  return <ProfileEditForm member={me.data} />;
}

function ProfileEditForm({ member }: { member: import("../../api/members/me").MemberInfo }) {
  const updateMutation = useUpdateMeMutation();
  const profile = useProfilePreviewStore();
  const [nickname, setNickname] = useState(member.nickname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  function changeAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setNotice("JPG 또는 PNG 파일을 5MB 이하로 선택해주세요.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setNotice("");
      }
    };
    reader.onerror = () =>
      setNotice("이미지를 읽지 못했어요. 다시 선택해주세요.");
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isNicknameValid) return;
    if (updateMutation.isPending) return;
    updateMutation.mutate({ nickname: nickname.trim() }, {
      onSuccess: () => {
        profile.updateProfile(nickname.trim(), avatar);
        router.push("/profile");
      },
    });
  }

  return (
    <main className="profile-page profile-edit-page">
      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <div className="profile-heading">
          <div>
            <h1>내 정보 수정</h1>
            <p>닉네임을 수정할 수 있어요. 프로필 이미지는 이 브라우저에서만 미리보기로 반영돼요.</p>
          </div>
          <button
            className="profile-primary"
            type="submit"
            disabled={!isNicknameValid || updateMutation.isPending}
          >
            변경사항 저장
          </button>
        </div>
        <div className="profile-edit-content">
          <div className="profile-upload">
            <label
              className="profile-avatar profile-avatar-edit"
              htmlFor="profile-image"
            >
              <img
                className={
                  avatar ? "profile-avatar-photo" : "profile-avatar-icon"
                }
                src={avatar || "/movie-icons/person.svg"}
                alt="프로필 이미지"
              />
              <span className="profile-avatar-edit-icon">
                <img src="/movie-icons/edit.svg" alt="" />
              </span>
            </label>
            <input
              className="profile-file-input"
              id="profile-image"
              type="file"
              accept="image/jpeg,image/png"
              onChange={changeAvatar}
            />
            <label className="profile-upload-label" htmlFor="profile-image">
              프로필 이미지
            </label>
            <p>JPG·PNG, 최대 5MB</p>
          </div>
          <div className="profile-edit-fields">
            <div className="profile-edit-field">
              <label htmlFor="profile-nickname">닉네임</label>
              <div className="profile-edit-input-row">
                <input
                  id="profile-nickname"
                  name="nickname"
                  value={nickname}
                  placeholder="2–12자"
                  onChange={(event) => {
                    setNickname(event.target.value);
                    setNotice("");
                  }}
                  aria-invalid={!isNicknameValid}
                />
                <button
                  type="button"
                  disabled={!isNicknameValid || updateMutation.isPending}
                  onClick={async () => {
                    if (nickname.trim() === member.nickname) { setNotice("현재 사용 중인 닉네임이에요."); return; }
                    try {
                      const result = await checkNicknameDuplicate(nickname.trim());
                      setNotice(result.available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
                    } catch { setNotice("중복 확인에 실패했어요."); }
                  }}
                >
                  중복 확인
                </button>
              </div>
              {!isNicknameValid && (
                <p className="profile-error">
                  닉네임은 2자 이상 12자 이하로 입력해주세요.
                </p>
              )}
            </div>
            <div className="profile-edit-field">
              <label htmlFor="profile-email">이메일</label>
              <div className="profile-edit-input-row">
                <input
                  id="profile-email"
                  type="email"
                  value={member.email}
                  readOnly
                />
              </div>
            </div>
            {notice && (
              <p className="profile-notice" role="status">
                {notice}
              </p>
            )}
            <p className="profile-preview-note">
              닉네임은 서버에 저장됩니다. 프로필 이미지 업로드 API는 지원하지 않습니다.
            </p>
          </div>
        </div>
      </form>
      <section
        className="profile-danger"
        aria-labelledby="profile-delete-title"
      >
        <div>
          <h2 id="profile-delete-title">회원 탈퇴</h2>
          <p>
            탈퇴하면 작성한 평점, 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setNotice(
              "회원 탈퇴 API는 연결하지 않았으며, 실제 회원 정보는 삭제되지 않습니다.",
            )
          }
        >
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
