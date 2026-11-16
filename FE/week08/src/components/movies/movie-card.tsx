import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[2/2.82] overflow-hidden rounded-lg bg-[#e7e9ee] shadow-[0_1px_2px_rgba(17,24,39,0.08)]">
        <Link
          className="block h-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-500/50"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {posterUrl ? (
            <img
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.015]"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-sm text-[#737985]">
              이미지 없음
            </span>
          )}
        </Link>
        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          variant="overlay"
        />
      </div>
      <h2 className="mt-3 mb-[5px] overflow-hidden text-[15px] leading-[1.4] font-bold tracking-[-0.35px] text-ellipsis whitespace-nowrap text-[#202228]">
        <Link
          className="text-inherit no-underline hover:text-[#2669ee]"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          {movie.title}
        </Link>
      </h2>
      <time
        className="text-xs leading-[1.4] text-[#8c919b]"
        dateTime={movie.release_date}
      >
        {movie.release_date || "개봉일 정보 없음"}
      </time>
    </article>
  );
}
