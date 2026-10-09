import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";

function DetailSummary({ movie }: { movie: Movie }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <div className="pt-[3px]">
      <h2 className="mb-1 text-[15px] leading-[1.3] font-extrabold tracking-[-0.6px] text-[#252a34]">{movie.title}</h2>
      <p className="mb-2 text-[11px] leading-[1.5] font-bold text-[#373d48]">{movie.tagline}</p>
      <p className="text-[11px] leading-[1.55] text-[#626975]">{movie.overview}</p>
      <button
        className="mt-3 inline-flex h-[26px] items-center gap-1 rounded bg-[#2f65dd] px-2 text-[10px] font-bold text-white"
        type="button"
        aria-pressed={isBookmarked}
        onClick={() => toggleBookmark(movie.id)}
      >
        <img
          className="h-3 w-3 invert"
          src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
        />
        {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
      </button>
    </div>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="grid min-h-[calc(100vh-56px)] place-content-center gap-[15px] bg-[#f6f7f9] text-center text-[#424955]">
        <p>영화를 찾을 수 없어요.</p>
        <Link className="text-[13px] text-[#2865e7] no-underline" to="/">영화 목록으로 돌아가기</Link>
      </main>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-[#f6f7f9]">
      <main className="flex-1">
        <section className="relative h-[225px] bg-cover bg-center" style={{ backgroundImage: `url(${movie.backdropPath})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d14]/80 via-[#080d14]/40 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1120px] flex-col justify-end px-6 pt-[22px] pb-1 text-white md:px-12">
            <Link className="absolute top-[18px] text-[11px] font-bold text-white no-underline" to="/">‹ 영화 목록</Link>
            <p className="mb-[6px] text-[11px] font-bold opacity-85">{movie.genres.join(" · ")}</p>
            <h1 className="mb-1 text-[23px] leading-[1.2] font-extrabold tracking-[-1.4px] text-white md:text-[28px]">{movie.title}</h1>
            <p className="text-[11px] opacity-90">{movie.originalTitle}</p>
            <p className="mt-1 text-[11px] opacity-90">{movie.releaseDate} · {movie.runtime} · {movie.genres.join(" · ")}</p>
          </div>
        </section>

        <section className="mx-auto grid min-h-[310px] w-full max-w-[1120px] grid-cols-1 gap-[22px] bg-[#f6f7f9] px-6 pt-5 pb-[55px] md:grid-cols-[125px_minmax(0,1fr)_205px] md:px-12">
          <img className="h-[175px] w-[125px] rounded-[5px] object-cover shadow-[0_8px_18px_rgba(25,30,40,0.2)]" src={movie.posterPath} alt={`${movie.title} 포스터`} />
          <DetailSummary key={movie.id} movie={movie} />
          <aside className="pt-2 md:pt-[2px] md:pl-2" aria-label="내 평점">
            <h2 className="mb-2 text-[15px] font-extrabold tracking-[-0.6px] text-[#252a34]">내 평점</h2>
            <p className="text-[10px] text-[#7e8590]">이 영화는 어떠셨나요?</p>
            <div className="my-2 flex gap-[5px]" aria-label="별점 5점">
              {[1, 2, 3, 4, 5].map((star) => (
                <img className="h-[18px] w-[18px] opacity-80" key={star} src="/icons/star-outline.svg" alt="" />
              ))}
            </div>
            <textarea className="min-h-[60px] w-full resize-y rounded-[3px] border border-[#e0e3e8] bg-white p-[9px] text-[10px] text-[#3d4350] outline-[#2865e7]" aria-label="한줄평" placeholder="영화에 대한 한줄평을 남겨보세요." />
            <button className="mt-2.5 h-[30px] w-full cursor-pointer rounded-[3px] border-0 bg-[#20242b] text-[10px] font-bold text-white" type="button">확인 저장</button>
          </aside>
        </section>
      </main>
      <footer className="flex min-h-9 items-center justify-center gap-2 border-t border-[#e7e9ed] bg-white px-6 text-center text-[10px] text-[#8a9099] md:justify-end md:px-12">
        <img className="w-[22px]" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </div>
  );
}
