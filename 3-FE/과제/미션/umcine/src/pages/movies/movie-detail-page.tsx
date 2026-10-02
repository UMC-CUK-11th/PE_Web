import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  // 필수 1: movieId로 상세 정보를 찾고 없는 영화도 처리한다.
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  if (!movie)
    return (
      <main className="mx-auto w-full max-w-7xl px-5 py-12">
        <h1 className="mb-4 text-2xl font-bold">영화를 찾을 수 없어요.</h1>
        <Link to="/" className="text-blue-600 underline">
          영화 목록으로
        </Link>
      </main>
    );
  return (
    <main className="relative isolate flex-1 overflow-hidden bg-slate-950 text-white">
      <img
        src={movie.backdropPath}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/80" />
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-10 sm:py-14">
        <Link
          to="/"
          className="mb-8 inline-block text-sm text-slate-200 hover:underline"
        >
          영화 목록
        </Link>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="w-48 self-start rounded-lg sm:w-64 lg:w-72"
          />
          <div className="max-w-2xl py-2">
            <h1 className="text-3xl leading-snug font-bold sm:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-3 text-lg text-slate-300">{movie.originalTitle}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
              <div>
                <dt className="sr-only">개봉일</dt>
                <dd>{movie.releaseDate}</dd>
              </div>
              <div>
                <dt className="sr-only">장르</dt>
                <dd>{movie.genres.join(" · ")}</dd>
              </div>
              <div>
                <dt className="sr-only">상영 시간</dt>
                <dd>{movie.runtime}</dd>
              </div>
            </dl>
            <h2 className="mt-10 text-xl font-semibold">{movie.tagline}</h2>
            <p className="mt-4 text-base leading-8 text-slate-200">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
