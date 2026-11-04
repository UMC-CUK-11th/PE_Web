import { Link } from "@tanstack/react-router";
import { BookmarkButton } from "../bookmark-button";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "./movie-image";

export default function MovieCard({ movie }: { movie: TmdbMovieListItem }) {
  return <article className="min-w-0">
    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
      <MovieImage className="block aspect-[2/3] w-full rounded-[7px] object-cover"
        src={getTmdbPosterUrl(movie.poster_path)} alt={movie.title + " 포스터"} />
    </Link>
    <BookmarkButton movieId={movie.id} />
    <h2 className="mb-1 mt-2 truncate text-[13px] font-semibold text-[#222]">{movie.title}</h2>
    <p className="m-0 text-[11px] text-[#777]">{movie.release_date || "개봉일 정보 없음"}</p>
  </article>;
}
