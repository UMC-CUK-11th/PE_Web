import { Link } from "@tanstack/react-router";
import { useQueries } from "@tanstack/react-query";
import { useUserStore } from "../../stores/user-store";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetail } from "../../api/movies/get-movie-detail";

export function MyPage() {
  const { nickname, email } = useUserStore();
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const movieQueries = useQueries({
    queries: bookmarkedMovieIds.map((movieId) => ({
      queryKey: ["movie", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const movies = movieQueries
    .map((query) => query.data)
    .filter((movie) => movie !== undefined);

  const isLoading = movieQueries.some((query) => query.isPending);
  const isError = movieQueries.some((query) => query.isError);

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

            <div>
              <p className="mb-2 text-xs text-gray-400">닉네임</p>
              <p className="text-sm font-semibold">{nickname}</p>
            </div>

            <div>
              <p className="mb-2 text-xs text-gray-400">이메일</p>
              <p className="text-sm font-semibold">{email}</p>
            </div>
          </div>
        </section>

        {/* 내 즐겨찾기 */}
        <section className="mt-7">
          <h2 className="mb-5 text-sm font-semibold text-gray-900">
            내 즐겨찾기
          </h2>

          {bookmarkedMovieIds.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 px-5 py-12 text-center text-sm text-gray-400">
              즐겨찾기한 영화가 없습니다.
            </div>
          ) : isLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">
              즐겨찾기 영화를 불러오는 중...
            </p>
          ) : isError ? (
            <p className="py-10 text-center text-sm text-red-500">
              영화 정보를 불러오지 못했습니다.
            </p>
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
