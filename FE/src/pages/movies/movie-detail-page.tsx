import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) return <main className="mx-auto max-w-[1200px] px-5 py-20 text-center"><h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1><Link to="/" className="mt-6 inline-block text-[#e50914]">영화 목록으로 돌아가기</Link></main>;

  return <main>
    <section className="relative isolate min-h-[560px] overflow-hidden">
      <img src={movie.backdropPath} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#141517] via-[#141517]/80 to-[#141517]/30" />
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:py-20">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-48 rounded-lg shadow-2xl md:w-64" />
        <div className="max-w-2xl"><Link to="/" className="text-sm font-bold text-[#e50914]">← 영화 목록</Link><h1 className="mt-4 text-3xl font-bold md:text-5xl">{movie.title}</h1><p className="mt-2 text-lg text-gray-300">{movie.originalTitle}</p><p className="mt-5 text-gray-300">{movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}</p><h2 className="mt-8 text-xl font-bold">{movie.tagline}</h2><p className="mt-3 leading-7 text-gray-200">{movie.overview}</p></div>
      </div>
    </section>
  </main>;
}
