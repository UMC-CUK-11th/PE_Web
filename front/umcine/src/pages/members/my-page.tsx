import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useState } from "react";
import { getMyProfile, myProfileQueryKey } from "../../api/members/get-my-profile";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { useAuthStore } from "../../stores/auth-store";
import { useBookmarkStore } from "../../stores/bookmark-store";

const PAGE_SIZE = 10;
const actionClassName = "inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60";

function FavoriteMovies() {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(bookmarkedMovieIds.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const offset = (currentPage - 1) * PAGE_SIZE;
  const movieQueries = useQueries({
    queries: bookmarkedMovieIds.slice(offset, offset + PAGE_SIZE).map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      retry: false,
    })),
  });
  const movies = movieQueries.flatMap(({ data }) => data ? [data] : []);

  return (
    <section className="pt-5" aria-labelledby="favorites-title">
      <h2 id="favorites-title" className="mb-3 text-sm font-extrabold">내 즐겨찾기</h2>
      {bookmarkedMovieIds.length === 0 && (
        <p className="py-10 text-center text-sm text-[#667080]">아직 즐겨찾기한 영화가 없어요.</p>
      )}
      {movies.length > 0 && <MovieGrid movies={movies} showBookmarkButton={false} />}
      {movieQueries.some((query) => query.isPending) && (
        <p role="status" className="py-5 text-center text-sm text-[#667080]">즐겨찾기 영화를 불러오는 중이에요.</p>
      )}
      {movieQueries.some((query) => query.isError) && (
        <p role="alert" className="py-5 text-center text-sm text-[#667080]">즐겨찾기 영화 정보를 불러오지 못했어요.</p>
      )}
      <Pagination currentPage={currentPage} pageCount={pageCount} onPageChange={setPage} showSinglePage />
    </section>
  );
}

function ProfileContent({ accessToken }: { accessToken: string }) {
  const profileQuery = useQuery({
    queryKey: myProfileQueryKey,
    queryFn: ({ signal }) => getMyProfile(accessToken, signal),
    retry: false,
  });

  if (profileQuery.isPending) {
    return <p role="status" className="py-12 text-center text-sm text-[#667080]">내 정보를 불러오는 중이에요.</p>;
  }

  if (profileQuery.isError) {
    const needsLogin = isHTTPError(profileQuery.error) && profileQuery.error.response.status === 401;
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-sm text-[#667080]">
        <p role="alert">{needsLogin ? "다시 로그인해 주세요." : "내 정보를 불러오지 못했어요."}</p>
        {needsLogin ? (
          <Link className={actionClassName} to="/login">로그인</Link>
        ) : (
          <button type="button" className={actionClassName} onClick={() => void profileQuery.refetch()}>다시 시도</button>
        )}
      </div>
    );
  }

  return (
    <>
      <section className="border-b border-[#e7e9ed] pb-3" aria-labelledby="profile-info-title">
        <h2 id="profile-info-title" className="mb-3 text-sm font-extrabold">기본 정보</h2>
        <div className="flex items-center gap-5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#e2e5e9]">
            <img className="h-9 w-9" src="/icons/person.svg" alt="" />
          </div>
          <dl className="grid min-w-0 flex-1 gap-x-6 gap-y-2 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <div className="min-w-0">
              <dt className="text-[11px] text-[#667080]">닉네임</dt>
              <dd className="mt-1 text-xs font-bold break-all">{profileQuery.data.nickname}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[11px] text-[#667080]">이메일</dt>
              <dd className="mt-1 text-xs font-bold break-all">{profileQuery.data.email}</dd>
            </div>
          </dl>
        </div>
      </section>
      <FavoriteMovies />
    </>
  );
}

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return (
    <>
      <main className="mx-auto w-full flex-1 px-6 pt-[18px] pb-[72px] md:px-12">
        <div className="mb-3 flex items-center justify-between border-b border-[#e7e9ed] pb-4">
          <h1 className="text-[22px] leading-[1.25] font-extrabold tracking-[-1.1px]">내 정보</h1>
          {accessToken ? (
            <Link to="/my-page/edit" className={actionClassName}>정보 수정</Link>
          ) : (
            <button type="button" className={actionClassName} disabled>정보 수정</button>
          )}
        </div>
        {accessToken ? (
          <ProfileContent accessToken={accessToken} />
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-sm text-[#667080]">
            <p>내 정보를 보려면 로그인해 주세요.</p>
            <Link className={actionClassName} to="/login">로그인</Link>
          </div>
        )}
      </main>
      <TmdbFooter />
    </>
  );
}
