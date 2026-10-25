import type { Movie } from "../../types/movie";
import { tmdbImage } from "../../utils/movies/tmdb-image";
export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  original_language: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  video: boolean;
  genre_ids: number[];
}
export interface TmdbMovieList {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}
export interface TmdbMovieDetail extends Omit<TmdbMovie, "genre_ids"> {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
}
export function toMovie(movie: TmdbMovie | TmdbMovieDetail): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview || "등록된 줄거리가 없어요.",
    releaseDate: movie.release_date || "개봉일 정보 없음",
    posterPath: tmdbImage(movie.poster_path) ?? "",
    backdropPath: tmdbImage(movie.backdrop_path, "w1280") ?? "",
    genres: "genres" in movie ? movie.genres.map((genre) => genre.name) : [],
    runtime: "runtime" in movie && movie.runtime ? `${movie.runtime}분` : "상영 시간 정보 없음",
    tagline: "tagline" in movie ? movie.tagline : "",
  };
}
