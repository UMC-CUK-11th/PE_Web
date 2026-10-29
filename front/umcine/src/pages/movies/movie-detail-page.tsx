import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/tmdb-image";

function DetailSummary({ movie }: { movie: TmdbMovieDetail }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <div className="pt-[3px]">
      <h2 className="mb-1 text-[15px] leading-[1.3] font-extrabold tracking-[-0.6px] text-[#252a34]">{movie.title}</h2>
      {movie.tagline && <p className="mb-2 text-[11px] leading-[1.5] font-bold text-[#373d48]">{movie.tagline}</p>}
      <p className="text-[11px] leading-[1.55] text-[#626975]">{movie.overview || "줄거리 정보가 없어요."}</p>
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

function DetailMessage({ message, isError = false }: { message: string; isError?: boolean }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-[#f6f7f9]">
      <main className="grid flex-1 place-content-center gap-[15px] text-center text-[#424955]">
        <p role={isError ? "alert" : "status"}>{message}</p>
        <Link className="text-[13px] text-[#2865e7] no-underline" to="/">영화 목록으로 돌아가기</Link>
      </main>
      <TmdbFooter />
    </div>
  );
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getMovieDetail(movieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error: unknown) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [movieId]);

  if (isLoading) return <DetailMessage message="영화 정보를 불러오는 중이에요." />;
  if (errorMessage) return <DetailMessage message={errorMessage} isError />;
  if (!movie) return <DetailMessage message="영화를 찾을 수 없어요." isError />;

  const genres = movie.genres.map((genre) => genre.name).join(" · ");
  const releaseDate = movie.release_date ? movie.release_date.replaceAll("-", ".") : "개봉일 미정";
  const runtime = movie.runtime == null ? "상영 시간 미정" : `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`;
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-[#f6f7f9]">
      <main className="flex-1">
        <section className="relative h-[225px] bg-[#141b24] bg-cover bg-center" style={{ backgroundImage: backdropUrl ? `url("${backdropUrl}")` : undefined }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080d14]/80 via-[#080d14]/40 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1120px] flex-col justify-end px-6 pt-[22px] pb-1 text-white md:px-12">
            <Link className="absolute top-[18px] text-[11px] font-bold text-white no-underline" to="/">‹ 영화 목록</Link>
            {genres && <p className="mb-[6px] text-[11px] font-bold opacity-85">{genres}</p>}
            <h1 className="mb-1 text-[23px] leading-[1.2] font-extrabold tracking-[-1.4px] text-white md:text-[28px]">{movie.title}</h1>
            <p className="text-[11px] opacity-90">{movie.original_title}</p>
            <p className="mt-1 text-[11px] opacity-90">{releaseDate} · {runtime}{genres && ` · ${genres}`}</p>
          </div>
        </section>

        <section className="mx-auto grid min-h-[310px] w-full max-w-[1120px] grid-cols-1 gap-[22px] bg-[#f6f7f9] px-6 pt-5 pb-[55px] md:grid-cols-[125px_minmax(0,1fr)_205px] md:px-12">
          {posterUrl ? (
            <img className="h-[175px] w-[125px] rounded-[5px] object-cover shadow-[0_8px_18px_rgba(25,30,40,0.2)]" src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <div className="grid h-[175px] w-[125px] place-items-center rounded-[5px] bg-[#dfe2e8] text-xs text-[#687080]">포스터 없음</div>
          )}
          <DetailSummary movie={movie} />
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
      <TmdbFooter />
    </div>
  );
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const numericId = Number(movieId);

  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    return <DetailMessage message="영화를 찾을 수 없어요." isError />;
  }

  return <MovieDetailContent key={numericId} movieId={numericId} />;
}
