import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  // 주소의 번호표를 읽고, 같은 id를 가진 영화를 찾아요.
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">영화 목록</Link>
      </main>
    );
  }

  return (
    <main className="pb-16">
      <div className="relative h-52 overflow-hidden bg-slate-900 sm:h-80">
        <img src={movie.backdropPath} alt="" aria-hidden="true" className="size-full object-cover opacity-70" />
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link to="/" className="my-7 inline-flex items-center gap-2 rounded text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600">
          <span aria-hidden="true">←</span> 영화 목록
        </Link>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
          <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="aspect-[2/3] w-48 shrink-0 self-start rounded-xl object-cover shadow-md sm:w-60" />
          <div className="min-w-0 py-2">
            <h1 className="text-3xl leading-tight font-bold break-keep sm:text-4xl">{movie.title}</h1>
            <p className="mt-3 text-lg text-slate-500">{movie.originalTitle}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              <p>{movie.releaseDate}</p>
              <p>{movie.genres.join(" · ")}</p>
              <p>{movie.runtime}</p>
            </div>
            <h2 className="mt-8 text-xl font-semibold break-keep">{movie.tagline}</h2>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">{movie.overview}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
