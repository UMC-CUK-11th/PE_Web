import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { BookmarkButton } from "../bookmark-button";
import { MoviePoster } from "./movie-poster";

export function MovieCard({ movie }: { movie: TmdbMovieListItem }) {
  return (
    <article>
      <div className="relative aspect-[240/274] overflow-hidden rounded-lg bg-slate-200">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={`${movie.title} 상세 보기`}
        >
          <MoviePoster
            posterPath={movie.poster_path}
            title={movie.title}
            className="h-full w-full"
          />
        </Link>
        <BookmarkButton movieId={movie.id} title={movie.title} overlay />
      </div>
      <h2 className="mt-3 mb-1.5 text-[15px] leading-snug font-bold wrap-anywhere">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h2>
      <time className="text-[13px] text-[#6a7081]" dateTime={movie.release_date}>
        {formatReleaseDate(movie.release_date)}
      </time>
    </article>
  );
}
