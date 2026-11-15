import { Link } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useProfilePreviewStore } from "../../stores/profile-preview-store";
import "./profile-page.css";

const previewFavorites = [movies[0], movies[1], movies[4]];

export function ProfilePage() {
  const nickname = useProfilePreviewStore((state) => state.nickname);
  const email = useProfilePreviewStore((state) => state.email);
  const avatar = useProfilePreviewStore((state) => state.avatar);

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
        <div className="profile-movie-grid">
          {previewFavorites.map((movie) => (
            <article className="profile-movie-card" key={movie.id}>
              <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
              <h3>{movie.title}</h3>
              <p>{movie.releaseDate}</p>
            </article>
          ))}
        </div>
        <nav className="profile-pagination" aria-label="즐겨찾기 페이지">
          <button type="button" aria-label="이전 페이지" disabled><img src="/movie-icons/chevron-left.svg" alt="" /></button>
          <button type="button" className="profile-current-page" aria-current="page">1</button>
          <button type="button" aria-label="다음 페이지" disabled><img src="/movie-icons/chevron-right.svg" alt="" /></button>
        </nav>
      </section>
      <p className="profile-preview-note">퍼블리싱 예시 데이터입니다. 실제 회원·즐겨찾기 조회 API는 연결하지 않았습니다.</p>
    </main>
  );
}
