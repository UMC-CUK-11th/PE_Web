import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ProfileAvatar } from "../../components/member/profile-avatar";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import { useMemberPreviewStore } from "../../stores/member-preview-store";
import "./member-pages.css";

// 디자인 확인용 샘플입니다. 실제 즐겨찾기 API 연결 시 교체합니다.
const previewFavorites = movies.filter((movie) => [1, 2, 5].includes(movie.id));
const MOVIES_PER_PAGE = 5;

export function MyPage() {
  const profile = useMemberPreviewStore((state) => state.profile);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(previewFavorites.length / MOVIES_PER_PAGE);
  const visibleMovies = previewFavorites.slice((page - 1) * MOVIES_PER_PAGE, page * MOVIES_PER_PAGE);

  return (
    <main className="member-page" aria-labelledby="my-page-title">
      <div className="member-heading member-heading-bordered">
        <h1 id="my-page-title">내 정보</h1>
        <Link to="/mypage/edit" className="member-primary">정보 수정</Link>
      </div>

      <section className="member-basic" aria-labelledby="basic-title">
        <h2 id="basic-title">기본 정보</h2>
        <div className="member-basic-row">
          <ProfileAvatar src={profile.avatarUrl} />
          <dl className="member-detail">
            <dt>닉네임</dt>
            <dd>{profile.nickname || "닉네임을 설정해 주세요."}</dd>
          </dl>
          <dl className="member-detail">
            <dt>이메일</dt>
            <dd>{profile.email || "이메일 정보가 없어요."}</dd>
          </dl>
        </div>
      </section>

      <section className="member-favorites" aria-labelledby="favorites-title">
        <h2 id="favorites-title">내 즐겨찾기</h2>
        <ul className="member-movies">
          {visibleMovies.map((movie) => (
            <li key={movie.id}>
              <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
              <h3>{movie.title}</h3>
              <p>{movie.releaseDate}</p>
            </li>
          ))}
        </ul>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </main>
  );
}
