import { Link } from "@tanstack/react-router";
import { useMeQuery } from "../../hooks/use-me-query";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";
import "./profile-page.css";
import { FavoritesList } from "../../components/movies/favorites-list";


export function ProfilePage() {
  const meQuery = useMeQuery();
  const nickname = meQuery.data?.nickname ?? "";
  const email = meQuery.data?.email ?? "";
  const avatar = useProfilePreviewStore((state) => state.avatar);

  if (meQuery.isLoading) return <main className="profile-page">내 정보를 불러오는 중이에요.</main>;
  if (meQuery.isError) return <main className="profile-page">내 정보를 불러오지 못했어요.</main>;

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <h1>내 정보</h1>
        <Link className="profile-primary" to="/profile/edit">내 정보 수정</Link>
      </div>
      <section className="profile-info" aria-labelledby="profile-info-title">
        <h2 id="profile-info-title">기본 정보</h2>
        <div className="profile-info-row">
          <div className="profile-avatar">
            <img className={avatar ? "profile-avatar-photo" : "profile-avatar-icon"} src={avatar || "/movie-icons/person.svg"} alt="프로필 이미지" />
          </div>
          <dl className="profile-details">
            <div><dt>닉네임</dt><dd>{nickname}</dd></div>
            <div><dt>이메일</dt><dd>{email}</dd></div>
          </dl>
        </div>
      </section>
      <section className="profile-favorites" aria-labelledby="profile-favorites-title">
        <h2 id="profile-favorites-title">내 즐겨찾기</h2>
        <FavoritesList />
      </section>
    </main>
  );
}
