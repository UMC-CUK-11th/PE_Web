import { BookmarkButton } from "../../components/bookmark-button";
import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { MoviePoster } from "../../components/movies/movie-poster";
import { RequestStatus } from "../../components/request-status";
import { formatReleaseDate, formatRuntime } from "../../utils/movies/format-movie";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";

const INVALID_MOVIE_ID_MESSAGE = "올바르지 않은 영화 번호예요.";

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

  const movie = movieDetailQuery.data;
  // 잘못된 번호는 요청하지 않아도 isPending이 참이라 로딩보다 먼저 거른다
  const errorMessage = !isValidMovieId
    ? INVALID_MOVIE_ID_MESSAGE
    : movieDetailQuery.isError
      ? getMovieDetailErrorMessage(movieDetailQuery.error)
      : null;
  const isLoading = !errorMessage && movieDetailQuery.isPending;

  if (isLoading || errorMessage || !movie)
    return (
      <main className="mx-auto w-full max-w-7xl px-5 py-12">
        {isLoading ? (
          <RequestStatus message="영화 정보를 불러오는 중이에요." />
        ) : (
          <>
            <h1 className="mb-4 text-2xl font-bold">
              {errorMessage ?? "영화 정보를 불러오지 못했어요."}
            </h1>
            <Link to="/" className="text-blue-600 underline">
              영화 목록으로
            </Link>
          </>
        )}
      </main>
    );

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  return (
    <main className="relative isolate flex-1 overflow-hidden bg-slate-950 text-white">
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 flex items-end justify-end bg-slate-500 p-4 text-sm"
        >
          이미지 없음
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-slate-950/80" />
      <div className="mx-auto max-w-[1360px] px-5 py-10 sm:px-10 sm:py-14">
        <Link
          to="/"
          className="mb-8 inline-block text-sm text-slate-200 hover:underline"
        >
          영화 목록
        </Link>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
          <MoviePoster
            posterPath={movie.poster_path}
            title={movie.title}
            className="aspect-[2/3] w-48 shrink-0 self-start rounded-lg sm:w-64 lg:w-72"
          />
          <div className="max-w-2xl py-2">
            <h1 className="text-3xl leading-snug font-bold sm:text-4xl">
              {movie.title}
            </h1>
            <p className="mt-3 text-lg text-slate-300">{movie.original_title}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
              <div>
                <dt className="sr-only">개봉일</dt>
                <dd>{formatReleaseDate(movie.release_date)}</dd>
              </div>
              <div>
                <dt className="sr-only">장르</dt>
                <dd>{movie.genres.map((genre) => genre.name).join(", ")}</dd>
              </div>
              <div>
                <dt className="sr-only">상영 시간</dt>
                <dd>{formatRuntime(movie.runtime)}</dd>
              </div>
            </dl>
            {movie.tagline && (
              <h2 className="mt-10 text-xl font-semibold">{movie.tagline}</h2>
            )}
            <p className="mt-4 text-base leading-8 text-slate-200">
              {movie.overview}
            </p>
            <BookmarkButton movieId={movie.id} title={movie.title} />
          </div>
        </div>
      </div>
    </main>
  );
}
