import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";
import "./profile-page.css";

export function ProfileEditPage() {
  const profile = useProfilePreviewStore();
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();
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
    profile.updateProfile(nickname.trim(), avatar);
    navigate({ to: "/profile" });
  }

  return (
    <main className="profile-page profile-edit-page">
      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <div className="profile-heading">
          <div>
            <h1>내 정보 수정</h1>
            <p>닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button
            className="profile-primary"
            type="submit"
            disabled={!isNicknameValid}
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
                  disabled={!isNicknameValid}
                  onClick={() =>
                    setNotice(
                      "퍼블리싱 단계로, 닉네임 중복 확인 API는 아직 연결하지 않았습니다.",
                    )
                  }
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
                  value={profile.email}
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
              변경사항은 이 브라우저의 메모리에만 반영됩니다. 새로고침하면 예시
              값으로 돌아옵니다.
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
