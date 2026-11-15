import { Link } from "@tanstack/react-router";
import { useQuery, useQueries } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMe } from "../../api/members/me";
import { getFavorites } from "../../api/favorites";
import { useAuthStore } from "../../stores/auth-store";

export function MyPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 회원 정보 조회
  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // 서버에서 즐겨찾기 목록 조회
  const favoritesQuery = useQuery({
    queryKey: ["favorites", "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    staleTime: 30 * 1000,
    retry: false,
  });

  // 즐겨찾기 목록에서 영화 ID 추출
  const bookmarkedMovieIds =
    favoritesQuery.data?.map((favorite) => favorite.movieId) ?? [];

  // 각 영화의 상세 정보 조회
  const movieQueries = useQueries({
    queries: bookmarkedMovieIds.map((movieId) => ({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const movies = movieQueries
    .map((query) => query.data)
    .filter((movie) => movie !== undefined);

  const isMovieLoading = movieQueries.some((query) => query.isPending);

  const isMovieError = movieQueries.some((query) => query.isError);

  const isFavoritesLoading = favoritesQuery.isPending || isMovieLoading;

  const isFavoritesError = favoritesQuery.isError || isMovieError;

  return (
    <main className="min-h-[calc(100vh-60px)] bg-gray-100 px-5 py-7">
      <div className="mx-auto max-w-[1100px]">
        {/* 상단 제목 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">내 정보</h1>

          <Link
            to="/mypage-edit"
            className="rounded-md bg-blue-600 px-5 py-3 text-xs font-semibold text-white hover:bg-blue-700"
          >
            내 정보 수정
          </Link>
        </div>

        {/* 기본 정보 */}
        <section className="mt-8 border-t border-gray-200 pt-5">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">
            기본 정보
          </h2>

          <div className="grid items-center gap-6 border-b border-gray-200 pb-7 md:grid-cols-[80px_1fr_1fr]">
            {/* 프로필 이미지 */}
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-gray-200">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-black"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2H4Z" />
              </svg>
            </div>

            {/* 닉네임 */}
            <div>
              <p className="mb-2 text-xs text-gray-400">닉네임</p>
              <p className="text-sm font-semibold">
                {!accessToken
                  ? "로그인이 필요합니다."
                  : meQuery.isPending
                    ? "불러오는 중..."
                    : meQuery.isError
                      ? "정보 조회 실패"
                      : meQuery.data.nickname}
              </p>
            </div>

            {/* 이메일 */}
            <div>
              <p className="mb-2 text-xs text-gray-400">이메일</p>
              <p className="text-sm font-semibold">
                {!accessToken
                  ? "-"
                  : meQuery.isPending
                    ? "불러오는 중..."
                    : meQuery.isError
                      ? "정보 조회 실패"
                      : meQuery.data.email}
              </p>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="mt-7">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">
            내 즐겨찾기
          </h2>

          {isFavoritesError ? (
            <p className="py-10 text-center text-sm text-red-500">
              즐겨찾기 정보를 불러오지 못했습니다.
            </p>
          ) : isFavoritesLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              즐겨찾기 영화를 불러오는 중...
            </p>
          ) : bookmarkedMovieIds.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 px-5 py-12 text-center text-sm text-gray-400">
              즐겨찾기한 영화가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {movies.map((movie) => (
                <Link
                  key={movie.id}
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="group"
                >
                  <div className="aspect-[2/3] w-full max-w-[240px] overflow-hidden rounded-xl bg-gray-200">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`${movie.title} 포스터`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        포스터 없음
                      </div>
                    )}
                  </div>

                  <p className="mt-3 truncate text-sm font-medium text-gray-900">
                    {movie.title}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {movie.release_date || "개봉일 미정"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
