import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movie";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            영화를 찾을 수 없어요.
          </h1>

          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-gray-600 hover:text-gray-900"
          >
            ← 영화 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 배경 이미지 */}
      <section className="relative h-[430px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />

        {/* 배경 어둡게 */}
        <div className="absolute inset-0 bg-black/55" />

        {/* 영화 기본 정보 */}
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto flex w-full max-w-7xl items-end gap-8 px-6 pb-10">
            <img
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
              className="w-44 rounded-xl shadow-xl md:w-52"
            />

            <div className="pb-2 text-white">
              <h1 className="text-3xl font-bold md:text-4xl">
                {movie.title}
              </h1>

              <p className="mt-2 text-base text-gray-300">
                {movie.originalTitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-200">
                <span>{movie.releaseDate}</span>
                <span>·</span>
                <span>{movie.genres.join(" · ")}</span>
                <span>·</span>
                <span>{movie.runtime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상세 내용 */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="mb-8 inline-block text-sm font-semibold text-gray-500 transition hover:text-gray-900"
        >
          ← 영화 목록
        </Link>

        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {movie.tagline}
          </h2>

          <p className="mt-5 text-base leading-8 text-gray-600">
            {movie.overview}
          </p>
        </div>
      </section>
    </main>
  );
}