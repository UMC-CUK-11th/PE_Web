import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="min-w-0">
      <div className="relative aspect-[0.88] overflow-hidden rounded-lg bg-[#dfe2e8]">
        <Link className="block h-full w-full" params={{ movieId: String(movie.id) }} to="/movies/$movieId">
          {posterUrl ? (
            <img className="block h-full w-full object-cover" src={posterUrl} alt={`${movie.title} 포스터`} />
          ) : (
            <span className="grid h-full place-items-center text-xs text-[#687080]">포스터 없음</span>
          )}
        </Link>
        <BookmarkButton movie={movie} />
      </div>
      <Link className="block overflow-hidden text-inherit no-underline" params={{ movieId: String(movie.id) }} to="/movies/$movieId">
        <h2 className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] leading-[1.2] font-bold tracking-[-0.3px] text-[#222731]" title={movie.title}>{movie.title}</h2>
      </Link>
      <div className="mt-0.5 flex items-center gap-1 text-[9px] leading-[1.2] text-[#7b818c]">
        {movie.release_date ? (
          <time dateTime={movie.release_date}>{movie.release_date.replaceAll("-", ".")}</time>
        ) : (
          <span>개봉일 미정</span>
        )}
      </div>
    </article>
  );
}
