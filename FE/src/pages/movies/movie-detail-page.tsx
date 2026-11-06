// URL의 영화 번호로 상세 정보와 북마크 버튼을 표시한다.
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  // 유효한 영화 번호만 조회하고 번호별로 상세 응답을 저장한다.
  const detailQuery = useQuery({
    queryKey: ["movies", "detail", parsedMovieId],
    queryFn: () => getMovieDetail(parsedMovieId),
    enabled: isValidMovieId,
  });

  const movie = detailQuery.data;
  const isLoading = detailQuery.isLoading;
  const errorMessage = detailQuery.isError
    ? getMovieDetailErrorMessage(detailQuery.error)
    : null;

  const statusMessage = !isValidMovieId ? "올바르지 않은 영화 번호예요."
    : isLoading ? "영화 정보를 불러오는 중이에요."
    : errorMessage ?? (!movie ? "영화를 찾을 수 없어요." : null);

  if (statusMessage || !movie) {
    return (
      <main className="mx-auto max-w-[1200px] px-5 py-20 text-center">
        <h1 role={!isValidMovieId || errorMessage ? "alert" : "status"} className="text-2xl font-bold">{statusMessage}</h1>
        <Link to="/" className="mt-6 inline-block text-[#e50914]">영화 목록으로 돌아가기</Link>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const runtime = typeof movie.runtime === "number"
    ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
    : "상영 시간 정보가 없어요.";

  return (
    <main>
      <section className="relative isolate min-h-[560px] overflow-hidden">
        {backdropUrl ? (
          <img src={backdropUrl} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40" />
        ) : (
          <div className="absolute inset-0 -z-20 flex items-start justify-end bg-gray-700 p-5 text-gray-300">이미지 없음</div>
        )}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#141517] via-[#141517]/80 to-[#141517]/30" />
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:py-20">
          {posterUrl ? (
            <img src={posterUrl} alt={`${movie.title} 포스터`} className="aspect-[2/3] w-48 rounded-lg object-cover shadow-2xl md:w-64" />
          ) : (
            <div className="flex aspect-[2/3] w-48 shrink-0 items-center justify-center rounded-lg bg-gray-700 text-gray-300 md:w-64">이미지 없음</div>
          )}
          <div className="max-w-2xl">
            <Link to="/" className="text-sm font-bold text-[#e50914]">← 영화 목록</Link>
            <h1 className="mt-4 text-3xl font-bold md:text-5xl">{movie.title}</h1>
            <p className="mt-2 text-lg text-gray-300">{movie.original_title}</p>
            <p className="mt-5 text-gray-300">{movie.release_date || "개봉일 정보 없음"} · {movie.genres.map((genre) => genre.name).join(", ") || "장르 정보 없음"} · {runtime}</p>
            <BookmarkButton movieId={movie.id} movieTitle={movie.title} className="mt-5" />
            {movie.tagline && <h2 className="mt-8 text-xl font-bold">{movie.tagline}</h2>}
            <p className="mt-3 leading-7 text-gray-200">{movie.overview || "줄거리 정보가 없어요."}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
