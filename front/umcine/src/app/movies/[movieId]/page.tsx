import type { Metadata } from "next";
import { cache } from "react";
import { getMovieDetailFromTmdb } from "@/api/movies/tmdb-movies";
import { DetailMessage, MovieDetailContent } from "@/features/movies/movie-detail-page";
import { getMovieDetailErrorMessage } from "@/utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "@/utils/tmdb-image";

interface MoviePageProps {
  params: Promise<{ movieId: string }>;
}

const getMovie = cache(getMovieDetailFromTmdb);
const isValidMovieId = (movieId: number) => Number.isSafeInteger(movieId) && movieId > 0;

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const movieId = Number((await params).movieId);
  if (!isValidMovieId(movieId)) return { title: "영화 상세" };

  try {
    const movie = await getMovie(movieId);
    const description = movie.overview || `${movie.title}의 영화 정보를 확인하세요.`;
    const image = getTmdbBackdropUrl(movie.backdrop_path) ?? getTmdbPosterUrl(movie.poster_path);

    return {
      title: movie.title,
      description,
      openGraph: {
        title: `${movie.title} | UMCine`,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: "영화 상세" };
  }
}

export default async function Page({ params }: MoviePageProps) {
  const movieId = Number((await params).movieId);
  if (!isValidMovieId(movieId)) {
    return <DetailMessage message="올바르지 않은 영화 번호예요." isError />;
  }

  let movie;
  try {
    movie = await getMovie(movieId);
  } catch (error) {
    return <DetailMessage message={getMovieDetailErrorMessage(error)} isError />;
  }

  return <MovieDetailContent movie={movie} />;
}
