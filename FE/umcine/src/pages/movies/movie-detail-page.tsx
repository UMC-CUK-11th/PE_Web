import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movie";
import { cn } from "../../utils/cn";

const iconPath = "/icons/movie-icons/movie-icons";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  const [rating, setRating] = useState(0);

  if (!movie) {
    return (
      <main className="grid min-h-[calc(100vh-112px)] place-content-center px-5 text-center">
        <p className="text-lg font-extrabold">영화를 찾을 수 없어요.</p>
        <Link className="mt-3 text-sm font-bold text-[#2563eb] no-underline hover:underline" to="/">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[#f7f8fb]">
      <section className="relative h-[300px] overflow-hidden text-white md:h-[360px]">
        <img className="absolute inset-0 h-full w-full object-cover object-center" src={movie.backdropPath} alt="" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/10" />

        <div className="relative mx-auto flex h-full w-full max-w-[1264px] flex-col px-4 md:px-8">
          <Link className="mt-5 w-fit text-[11px] font-semibold text-white/80 no-underline hover:text-white" to="/">
            ← 영화 목록
          </Link>
          <div className="mt-auto pb-8 md:pb-10 md:pl-[272px]">
            <p className="mb-2 text-[11px] font-semibold text-white/75">{movie.originalTitle}</p>
            <h1 className="text-2xl font-extrabold tracking-[-0.8px] md:text-[32px]">{movie.title}</h1>
            <p className="mt-2 text-[11px] text-white/75">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1264px] gap-7 px-4 pb-16 md:grid-cols-[224px_minmax(0,1fr)_260px] md:gap-8 md:px-8">
        <img
          className="relative z-10 -mt-20 hidden aspect-[2/3] w-full rounded-[4px] object-cover shadow-[0_12px_34px_rgba(20,21,25,0.2)] md:block"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

        <article className="pt-8 md:pt-9">
          <h2 className="text-base font-extrabold tracking-[-0.4px]">{movie.tagline}</h2>
          <dl className="mt-4 grid grid-cols-[64px_1fr] gap-y-2 text-[11px]">
            <dt className="font-bold text-[#8b8e96]">개봉일</dt>
            <dd>{movie.releaseDate}</dd>
            <dt className="font-bold text-[#8b8e96]">장르</dt>
            <dd>{movie.genres.join(", ")}</dd>
            <dt className="font-bold text-[#8b8e96]">상영 시간</dt>
            <dd>{movie.runtime}</dd>
          </dl>
          <p className="mt-5 max-w-2xl text-xs leading-6 text-[#5f626a]">{movie.overview}</p>
          <BookmarkButton movieId={movie.id} movieTitle={movie.title} variant="detail" />
        </article>

        <aside className="h-fit border-t border-[#e2e3e7] pt-6 md:mt-8 md:border-l md:border-t-0 md:pl-7 md:pt-0" aria-label="별점 남기기">
          <h2 className="text-sm font-extrabold">내 별점</h2>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                className="rounded p-0.5 transition hover:bg-[#eef0f4]"
                type="button"
                aria-label={`${score}점`}
                aria-pressed={rating === score}
                onClick={() => setRating(score)}
                key={score}
              >
                <img className={cn("size-5 opacity-45", score <= rating && "opacity-100 [filter:invert(44%)_sepia(90%)_saturate(3300%)_hue-rotate(210deg)_brightness(98%)]")} src={`${iconPath}/${score <= rating ? "star.svg" : "star-outline.svg"}`} alt="" />
              </button>
            ))}
          </div>
          <p className="mt-4 min-h-16 rounded bg-white p-3 text-[10px] leading-4 text-[#8b8e96]">
            {rating ? `${rating}점을 남겼어요.` : "이 영화는 어떠셨나요? 별점을 남겨 보세요."}
          </p>
        </aside>
      </section>
    </main>
  );
}
