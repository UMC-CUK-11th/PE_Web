import { Link, useParams } from "@tanstack/react-router";
import { SiteFooter } from "../../components/layout/site-footer";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <>
        <main className="mx-auto flex min-h-[calc(100vh-132px)] max-w-5xl flex-col items-center justify-center px-10 text-center">
          <p className="text-xl font-bold text-[#202228]">
            영화를 찾을 수 없어요.
          </p>
          <Link
            className="mt-5 rounded-lg bg-[#2669ee] px-5 py-3 text-sm font-bold text-white no-underline"
            to="/"
          >
            영화 목록으로 돌아가기
          </Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <main className="relative min-h-[calc(100vh-132px)] overflow-hidden bg-[#111318] text-white">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,17,0.96)_0%,rgba(10,12,17,0.82)_45%,rgba(10,12,17,0.48)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#111318_0%,transparent_45%)]" />

        <div className="relative mx-auto w-[min(calc(100%-80px),1200px)] py-12">
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 no-underline hover:text-white"
            to="/"
          >
            <img
              className="size-5 invert"
              src="/icons/chevron-left.svg"
              alt=""
            />
            영화 목록
          </Link>

          <section className="mt-10 grid grid-cols-[280px_1fr] items-center gap-14">
            <img
              className="w-[280px] rounded-xl object-cover shadow-2xl"
              src={movie.posterPath}
              alt={`${movie.title} 포스터`}
            />
            <div className="max-w-[700px]">
              <p className="text-base text-white/65">{movie.originalTitle}</p>
              <h1 className="mt-2 text-[42px] leading-tight font-extrabold tracking-[-1.5px]">
                {movie.title}
              </h1>
              <div className="mt-5 flex items-center gap-3 text-sm text-white/75">
                <span>{movie.releaseDate}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.genres.join(" · ")}</span>
                <span aria-hidden="true">·</span>
                <span>{movie.runtime}</span>
              </div>
              <h2 className="mt-10 text-2xl font-bold">{movie.tagline}</h2>
              <p className="mt-4 text-base leading-7 text-white/75">
                {movie.overview}
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
