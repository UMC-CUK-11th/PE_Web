import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/bookmark-button";
import { MovieImage } from "../../components/movies/movie-image";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });
  if (!isValidMovieId) return <main className="p-8">올바르지 않은 영화 번호예요.</main>;
  if (movieDetailQuery.isPending) return <main className="p-8" role="status">영화 상세 정보를 불러오는 중이에요.</main>;
  if (movieDetailQuery.isError) return <main className="p-8" role="alert">{getMovieDetailErrorMessage(movieDetailQuery.error)}</main>;
  const movie = movieDetailQuery.data;
  const runtime = movie.runtime === null ? "상영 시간 정보가 없어요."
    : Math.floor(movie.runtime / 60) + "시간 " + movie.runtime % 60 + "분";
  return <main className="min-h-[70vh] bg-[#f5f6f8] pb-12">
    <section className="relative flex min-h-[330px] items-end overflow-hidden bg-[#182124] text-white">
      <MovieImage className="absolute inset-0 h-full w-full object-cover"
        src={getTmdbBackdropUrl(movie.backdrop_path)} alt={movie.title + " 배경"} />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative mx-auto w-full max-w-[1180px] px-6 pb-10">
        <Link className="mb-5 inline-block text-white" to="/">← 영화 목록</Link>
        <p>{movie.original_title}</p>
        <h1 className="text-4xl font-bold">{movie.title}</h1>
        <p className="mt-3 text-sm">{movie.release_date} · {movie.genres.map((genre) => genre.name).join(" · ")} · {runtime}</p>
      </div>
    </section>
    <section className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-7 px-6 py-8 md:grid-cols-[180px_minmax(0,1fr)]">
      <MovieImage className="aspect-[2/3] w-[180px] rounded object-cover"
        src={getTmdbPosterUrl(movie.poster_path)} alt={movie.title + " 포스터"} />
      <div>
        <h2 className="mb-3 text-lg font-semibold">{movie.tagline || movie.title}</h2>
        <p className="mb-5 text-sm leading-7 text-gray-600">{movie.overview || "줄거리 정보가 없어요."}</p>
        <BookmarkButton movieId={movie.id} />
        <dl className="mt-6 grid gap-2 text-sm"><dt>개봉일</dt><dd>{movie.release_date || "정보 없음"}</dd><dt>상영 시간</dt><dd>{runtime}</dd></dl>
      </div>
    </section>
  </main>;
}
