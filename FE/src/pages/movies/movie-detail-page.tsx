// 이 파일은 /movies/$movieId 화면의 영화 상세 정보를 표시한다.
// URL에서 받은 ID로 공통 영화 데이터의 한 항목을 찾고 북마크 버튼에도 같은 ID를 넘긴다.
import { Link, useParams } from "@tanstack/react-router";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  // 주소의 movieId는 문자열이므로 숫자로 바꿔 movies의 id와 비교한다.
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  // URL에 해당하는 데이터가 없을 때도 사용자가 목록으로 돌아갈 수 있게 한다.
  if (!movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1>
        <Link to="/" className="mt-6 inline-block text-[#e50914]">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className="relative isolate min-h-[560px] overflow-hidden">
        {/* 배경 이미지는 장식용이므로 스크린 리더에서 숨긴다. */}
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#141517] via-[#141517]/80 to-[#141517]/30" />

        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:py-20">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-48 rounded-lg shadow-2xl md:w-64"
          />

          <div className="max-w-2xl">
            <Link to="/" className="text-sm font-bold text-[#e50914]">
              ← 영화 목록
            </Link>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">
              {movie.title}
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              {movie.originalTitle}
            </p>
            <p className="mt-5 text-gray-300">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>

            {/* 목록·검색 카드와 같은 스토어를 사용해 북마크 상태를 공유한다. */}
            <BookmarkButton
              movieId={movie.id}
              movieTitle={movie.title}
              className="mt-5"
            />

            <h2 className="mt-8 text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-3 leading-7 text-gray-200">
              {movie.overview}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
