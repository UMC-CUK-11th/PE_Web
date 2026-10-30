import type { TmdbMovieListItem } from "../../api/movies/models";
import type { Movie } from "../../types/movie";
import { getTmdbPosterUrl } from "./tmdb-image";

export type MovieCardData = Pick<Movie, "id" | "title" | "originalTitle" | "releaseDate" | "overview"> & {
  posterPath: string | null;
};

export function toMovieCard(movie: TmdbMovieListItem): MovieCardData {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    overview: movie.overview,
    posterPath: getTmdbPosterUrl(movie.poster_path),
  };
}
