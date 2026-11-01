import type { TmdbMovie } from "../../api/movies/models";
import { getTmdbPosterUrl } from "./tmdb-image";

export interface MovieCardModel {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string | null;
  overview: string;
}
export function toMovieCard(movie: TmdbMovie): MovieCardModel {
  return {
    id: movie.id, title: movie.title, originalTitle: movie.original_title,
    releaseDate: movie.release_date || "개봉일 정보 없음",
    posterPath: getTmdbPosterUrl(movie.poster_path), overview: movie.overview,
  };
}
export function formatRuntime(minutes: number | null) {
  if (minutes === null) return "상영 시간 정보가 없어요.";
  return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`;
}
