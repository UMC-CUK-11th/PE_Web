import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites/get-favorites";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { ProfileAvatar } from "../../components/member/profile-avatar";
import { Pagination } from "../../components/movies/pagination";
import { useMemberPreviewStore } from "../../stores/member-preview-store";
import { useAuthStore } from "../../stores/auth-store";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import "./member-pages.css";

const MOVIES_PER_PAGE = 5;

export function MyPage() {
  const profile = useMemberPreviewStore((state) => state.profile);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const queryClient = useQueryClient();
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const [page, setPage] = useState(1);
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
  const favorites = favoritesQuery.data ?? [];
  const totalPages = Math.ceil(favorites.length / MOVIES_PER_PAGE);
  const currentPage = Math.min(page, Math.max(1, totalPages));
  const visibleFavorites = favorites.slice((currentPage - 1) * MOVIES_PER_PAGE, currentPage * MOVIES_PER_PAGE);
  const movieQueries = useQueries({
    queries: visibleFavorites.map((favorite) => ({
      queryKey: ["movies", "detail", favorite.movieId],
      queryFn: () => getMovieDetail(favorite.movieId),
      enabled: Boolean(accessToken),
    })),
  });

  if (!accessToken) {
    return <main className="member-page"><p>로그인 후 내 정보를 확인할 수 있어요.</p><Link to="/login">로그인하기</Link></main>;
  }
  if (meQuery.isPending) {
    return <main className="member-page"><p role="status">내 정보를 불러오는 중이에요.</p></main>;
  }
  if (meQuery.isError) {
    return <main className="member-page"><p className="member-error" role="alert">{getApiErrorMessage(meQuery.error, "내 정보를 불러오지 못했어요.")}</p><button type="button" onClick={() => meQuery.refetch()}>다시 불러오기</button></main>;
  }

  const member = meQuery.data;

  return (
    <main className="member-page" aria-labelledby="my-page-title">
      <div className="member-heading member-heading-bordered">
        <h1 id="my-page-title">내 정보</h1>
        <Link to="/mypage/edit" className="member-primary">정보 수정</Link>
      </div>

      <section className="member-basic" aria-labelledby="basic-title">
        <h2 id="basic-title">기본 정보</h2>
        <div className="member-basic-row">
          <ProfileAvatar src={profile.email === member.email ? profile.avatarUrl : null} />
          <dl className="member-detail">
            <dt>닉네임</dt>
            <dd>{member.nickname}</dd>
          </dl>
          <dl className="member-detail">
            <dt>이메일</dt>
            <dd>{member.email}</dd>
          </dl>
        </div>
        <div className="member-basic-actions">
          <button
            type="button"
            className="member-logout"
            onClick={() => {
              setAccessToken(null);
              queryClient.removeQueries({ queryKey: ["members", "me"] });
              queryClient.removeQueries({ queryKey: ["ratings"] });
              queryClient.removeQueries({ queryKey: ["favorites"] });
            }}
          >
            로그아웃
          </button>
        </div>
      </section>

      <section className="member-favorites" aria-labelledby="favorites-title">
        <h2 id="favorites-title">내 즐겨찾기</h2>
        {favoritesQuery.isPending ? (
          <p role="status">즐겨찾기를 불러오는 중이에요.</p>
        ) : favoritesQuery.isError ? (
          <>
            <p className="member-error" role="alert">{getApiErrorMessage(favoritesQuery.error, "즐겨찾기를 불러오지 못했어요.")}</p>
            <button type="button" onClick={() => favoritesQuery.refetch()}>다시 불러오기</button>
          </>
        ) : favorites.length === 0 ? (
          <p>즐겨찾기한 영화가 없어요.</p>
        ) : <>
        <ul className="member-movies">
          {visibleFavorites.map((favorite, index) => {
            const movieQuery = movieQueries[index];
            const movie = movieQuery.data;
            return (
              <li key={favorite.favoriteId}>
                {movie ? (
                  <Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>
                    <img src={getTmdbPosterUrl(movie.poster_path) ?? undefined} alt={`${movie.title} 포스터`} />
                    <h3>{movie.title}</h3>
                    <p>{movie.release_date}</p>
                  </Link>
                ) : movieQuery.isError ? (
                  <>
                    <Link to="/movies/$movieId" params={{ movieId: String(favorite.movieId) }}>영화 #{favorite.movieId}</Link>
                    <p role="alert">영화 정보를 불러오지 못했어요.</p>
                    <button type="button" onClick={() => movieQuery.refetch()}>다시 불러오기</button>
                  </>
                ) : <p role="status">영화 정보를 불러오는 중이에요.</p>}
              </li>
            );
          })}
        </ul>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>}
      </section>
    </main>
  );
}

