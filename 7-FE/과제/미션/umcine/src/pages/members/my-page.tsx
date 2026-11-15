import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { MovieCard } from "../../components/movies/movie-card";
import { RequestStatus } from "../../components/request-status";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useProfileStore } from "../../stores/profile-store";

function BookmarkedMovies() {
  const movieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  // 상세 화면과 같은 key를 써서 이미 받은 영화는 다시 요청하지 않는다
  const queries = useQueries({
    queries: movieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 30 * 1000,
    })),
  });
  const movies = queries.flatMap((query) => (query.data ? [query.data] : []));

  if (movieIds.length === 0) return <RequestStatus message="아직 즐겨찾기한 영화가 없어요." />;
  if (queries.some((query) => query.isPending)) return <RequestStatus message="즐겨찾기한 영화를 불러오는 중이에요." />;
  if (movies.length === 0) return <RequestStatus message="즐겨찾기한 영화를 불러오지 못했어요." tone="error" />;

  return (
    <section aria-label="즐겨찾기 목록" className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}

export function MyPage() {
  const profile = useProfileStore((state) => state.profile);
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10">
      <div className="flex items-center justify-between border-b border-[#e3e5eb] pb-6">
        <h1 className="text-2xl font-bold">내 정보</h1>
        <Link to="/my/edit" className="rounded-md bg-[#235ce8] px-4 py-2.5 text-xs font-semibold text-white">
          정보 수정
        </Link>
      </div>
      <section aria-labelledby="basic-info" className="border-b border-[#e3e5eb] py-6">
        <h2 id="basic-info" className="mb-4 text-[15px] font-bold">
          기본 정보
        </h2>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ProfileAvatar imageUrl={profile.imageUrl} className="size-[86px]" />
          <dl className="grid flex-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-[11px] text-[#9a9fae]">닉네임</dt>
              <dd className="text-sm font-bold">{profile.nickname}</dd>
            </div>
            <div>
              <dt className="mb-1 text-[11px] text-[#9a9fae]">이메일</dt>
              <dd className="text-sm font-bold wrap-anywhere">{profile.email}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section aria-labelledby="bookmarks" className="py-6">
        <h2 id="bookmarks" className="mb-4 text-[15px] font-bold">
          내 즐겨찾기
        </h2>
        <BookmarkedMovies />
      </section>
    </main>
  );
}
