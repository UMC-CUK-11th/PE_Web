import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe, type MemberInfo } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { ProfileAvatar } from "../../components/member/profile-avatar";
import { useAuthStore } from "../../stores/auth-store";
import { useMemberPreviewStore } from "../../stores/member-preview-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import "./member-pages.css";

export function EditProfilePage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (!accessToken) {
    return <main className="member-page"><p>로그인 후 내 정보를 수정할 수 있어요.</p><Link to="/login">로그인하기</Link></main>;
  }
  if (meQuery.isPending) {
    return <main className="member-page"><p role="status">내 정보를 불러오는 중이에요.</p></main>;
  }
  if (meQuery.isError) {
    return <main className="member-page"><p className="member-error" role="alert">{getApiErrorMessage(meQuery.error, "내 정보를 불러오지 못했어요.")}</p><button type="button" onClick={() => meQuery.refetch()}>다시 불러오기</button></main>;
  }

  return <EditProfileForm key={meQuery.data.email} member={meQuery.data} />;
}

function EditProfileForm({ member }: { member: MemberInfo }) {
  const profile = useMemberPreviewStore((state) => state.profile);
  const updateProfile = useMemberPreviewStore((state) => state.updateProfile);
  const navigate = useNavigate();
  const updateMeMutation = useUpdateMeMutation();
  const [nickname, setNickname] = useState(member.nickname);
  const [avatarUrl, setAvatarUrl] = useState(profile.email === member.email ? profile.avatarUrl : null);
  const [notice, setNotice] = useState("");
  const [imageError, setImageError] = useState("");
  const isNicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setImageError("JPG, PNG, WEBP 이미지를 선택해 주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("프로필 이미지는 최대 5MB까지 선택할 수 있어요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setImageError("");
      }
    };
    reader.onerror = () => setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
    reader.readAsDataURL(file);
  }

  function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isNicknameValid || imageError || updateMeMutation.isPending) return;
    updateMeMutation.mutate({ nickname: nickname.trim() }, {
      onSuccess: (response) => {
        updateProfile({ email: response.result.email, nickname: response.result.nickname, avatarUrl });
        navigate({ to: "/mypage" });
      },
    });
  }

  return (
    <main className="member-page member-edit-page" aria-labelledby="edit-profile-title">
      <form className="member-edit-form" onSubmit={handleSave} noValidate>
        <div className="member-heading">
          <div>
            <h1 id="edit-profile-title">내 정보 수정</h1>
            <p className="member-subtitle">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
          </div>
          <button className="member-primary" type="submit" disabled={!isNicknameValid || !!imageError || updateMeMutation.isPending}>
            {updateMeMutation.isPending ? "저장 중" : "저장"}
          </button>
        </div>

        <div className="member-editor">
          <div className="member-avatar-editor">
            <div className="member-avatar-picker">
              <ProfileAvatar src={avatarUrl} />
              <label className="member-avatar-edit" htmlFor="profile-image">
                <img src="/icons/movie-icons/edit.svg" alt="프로필 이미지 선택" />
              </label>
              <input id="profile-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} disabled={updateMeMutation.isPending} className="member-file-input" />
            </div>
            <h2>프로필 이미지</h2>
            <p className="member-hint">선택 사항 · 최대 5MB</p>
            {imageError && <p className="member-error" role="alert">{imageError}</p>}
          </div>

          <div className="member-fields">
            <div>
              <label htmlFor="profile-nickname">닉네임</label>
              <div className="member-input-wrap">
                <input id="profile-nickname" value={nickname} onChange={(event) => { setNickname(event.target.value); setNotice(""); }} disabled={updateMeMutation.isPending} aria-invalid={!isNicknameValid} aria-describedby={!isNicknameValid ? "profile-nickname-error" : undefined} maxLength={12} />
                <button className="member-check" type="button" disabled={!isNicknameValid || updateMeMutation.isPending} onClick={() => setNotice("중복 확인 기능은 준비 중이에요.")}>중복 확인</button>
              </div>
              {!isNicknameValid && <p className="member-error" id="profile-nickname-error">닉네임은 2~12자로 입력해 주세요.</p>}
            </div>
            <div>
              <label htmlFor="profile-email">이메일</label>
              <input id="profile-email" type="email" value={member.email} readOnly />
            </div>
            {notice && <p className="member-hint" role="status">{notice}</p>}
            {updateMeMutation.isError && <p className="member-error" role="alert">{getApiErrorMessage(updateMeMutation.error, "내 정보 수정에 실패했어요. 다시 시도해 주세요.")}</p>}
          </div>
        </div>

        <section className="member-danger" aria-labelledby="withdrawal-title">
          <div>
            <h2 id="withdrawal-title">회원 탈퇴</h2>
            <p>탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button type="button" onClick={() => setNotice("회원 탈퇴 기능은 준비 중이에요.")}>회원 탈퇴</button>
        </section>
      </form>
    </main>
  );
}
